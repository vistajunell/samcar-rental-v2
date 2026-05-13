"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin/session";
import { invalidateCacheTags } from "@/lib/admin/invalidate-cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  buildBookingNotificationContent,
  sendEmailNotification,
  sendSmsNotification,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export type NotificationActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const notificationSchema = z.object({
  channel: z.enum(["EMAIL", "SMS"]),
});

export async function sendBookingCommunicationAction(
  bookingId: string,
  _prev: NotificationActionState | undefined,
  formData: FormData,
): Promise<NotificationActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = notificationSchema.safeParse({
    channel: formData.get("channel") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Choose a valid communication channel.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const channel = parsed.data.channel;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          contactNumber: true,
        },
      },
      car: {
        select: {
          brand: true,
          name: true,
          year: true,
        },
      },
      invoice: {
        select: {
          number: true,
        },
      },
    },
  });

  if (!booking) {
    return { ok: false, message: "Booking not found." };
  }

  const recipient =
    channel === "EMAIL" ? booking.customer.email : booking.customer.contactNumber;
  const content = buildBookingNotificationContent(
    {
      reference: booking.reference,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      customerContact: booking.customer.contactNumber,
      carLabel: `${booking.car.brand} ${booking.car.name} ${booking.car.year}`,
      startDateTime: booking.startDateTime,
      endDateTime: booking.endDateTime,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      invoiceNumber: booking.invoice?.number,
    },
    channel,
  );

  const log = await prisma.notificationLog.create({
    data: {
      type: channel,
      status: "PENDING",
      recipient,
      subject: content.subject,
      body: content.body,
      bookingId: booking.id,
    },
    select: { id: true },
  });

  try {
    const result =
      channel === "EMAIL"
        ? await sendEmailNotification(recipient, content)
        : await sendSmsNotification(recipient, content);

    await prisma.$transaction([
      prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: "SENT",
          providerResponse: result.providerResponse,
          sentAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "BOOKING_NOTIFICATION_SENT",
          entityType: "NotificationLog",
          entityId: log.id,
          metadata: {
            bookingId: booking.id,
            reference: booking.reference,
            channel,
            provider: result.provider,
            recipient,
          } as Prisma.InputJsonValue,
        },
      }),
    ]);

    revalidateNotificationViews(booking.id);
    return {
      ok: true,
      message: `${channel === "EMAIL" ? "Email" : "SMS"} sent to ${recipient}.`,
    };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown provider error.";

    await prisma.$transaction([
      prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: "FAILED",
          providerResponse: detail,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "BOOKING_NOTIFICATION_FAILED",
          entityType: "NotificationLog",
          entityId: log.id,
          metadata: {
            bookingId: booking.id,
            reference: booking.reference,
            channel,
            recipient,
            error: detail,
          } as Prisma.InputJsonValue,
        },
      }),
    ]);

    revalidateNotificationViews(booking.id);
    return {
      ok: false,
      message: `Could not send ${channel === "EMAIL" ? "email" : "SMS"}. ${detail}`,
    };
  }
}

function revalidateNotificationViews(bookingId: string) {
  invalidateCacheTags(CACHE_TAGS.notifications, CACHE_TAGS.bookings);
  revalidatePath("/admin/notifications");
  revalidatePath(`/admin/bookings/${bookingId}`);
}
