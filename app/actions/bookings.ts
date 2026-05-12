"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/session";

const TERMINAL: BookingStatus[] = ["REJECTED", "CANCELLED", "COMPLETED"];

export type BookingActionResult =
  | { ok: true; status: BookingStatus }
  | { ok: false; message: string };

async function transitionBooking(
  bookingId: string,
  next: BookingStatus,
  auditAction: string,
): Promise<BookingActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Not authorized." };
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, status: true, reference: true },
      });
      if (!booking) throw new Error("NOT_FOUND");

      if (TERMINAL.includes(booking.status)) {
        throw new Error("TERMINAL");
      }
      if (booking.status === next) {
        return booking;
      }

      const result = await tx.booking.update({
        where: { id: bookingId },
        data: { status: next },
        select: { id: true, status: true, reference: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: auditAction,
          entityType: "Booking",
          entityId: booking.id,
          metadata: {
            reference: booking.reference,
            from: booking.status,
            to: next,
          } as Prisma.InputJsonValue,
        },
      });

      return result;
    });

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    revalidatePath("/admin/dashboard");

    return { ok: true, status: updated.status };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return { ok: false, message: "Booking not found." };
      }
      if (err.message === "TERMINAL") {
        return {
          ok: false,
          message:
            "This booking is already in a terminal state (rejected, cancelled, or completed) and cannot be re-opened.",
        };
      }
    }
    throw err;
  }
}

export async function approveBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "APPROVED", "BOOKING_APPROVED");
}

export async function markBookingUnderReviewAction(
  bookingId: string,
): Promise<BookingActionResult> {
  return transitionBooking(
    bookingId,
    "UNDER_REVIEW",
    "BOOKING_MARKED_UNDER_REVIEW",
  );
}

export async function rejectBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "REJECTED", "BOOKING_REJECTED");
}
