"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type BookingStatus, type PaymentMethod } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/session";

const TERMINAL: BookingStatus[] = ["REJECTED", "CANCELLED", "COMPLETED"];
const MUTABLE_FOR_COMPLETE: BookingStatus[] = ["APPROVED"];

export type BookingActionResult =
  | { ok: true; status: BookingStatus }
  | { ok: false; message: string };

export type AdminNotesActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type PaymentActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

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

export async function cancelBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  return transitionBooking(bookingId, "CANCELLED", "BOOKING_CANCELLED");
}

export async function completeBookingAction(
  bookingId: string,
): Promise<BookingActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Not authorized." };

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          status: true,
          reference: true,
          paymentStatus: true,
        },
      });
      if (!booking) throw new Error("NOT_FOUND");
      if (booking.status === "COMPLETED") return booking;
      if (!MUTABLE_FOR_COMPLETE.includes(booking.status)) {
        throw new Error("INVALID_COMPLETE");
      }
      if (booking.paymentStatus !== "PAID") {
        throw new Error("UNPAID");
      }

      const result = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" },
        select: { id: true, status: true, reference: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "BOOKING_COMPLETED",
          entityType: "Booking",
          entityId: booking.id,
          metadata: {
            reference: booking.reference,
            from: booking.status,
            to: "COMPLETED",
          } as Prisma.InputJsonValue,
        },
      });

      return result;
    });

    revalidateBookingViews(bookingId);
    return { ok: true, status: updated.status };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return { ok: false, message: "Booking not found." };
      }
      if (err.message === "INVALID_COMPLETE") {
        return {
          ok: false,
          message: "Only approved bookings can be marked completed.",
        };
      }
      if (err.message === "UNPAID") {
        return {
          ok: false,
          message: "Record full payment before marking this booking completed.",
        };
      }
    }
    throw err;
  }
}

const adminNotesSchema = z.object({
  adminNotes: z.string().trim().max(2000, "Admin notes must be under 2,000 characters"),
});

export async function updateBookingAdminNotesAction(
  bookingId: string,
  _prev: AdminNotesActionState | undefined,
  formData: FormData,
): Promise<AdminNotesActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = adminNotesSchema.safeParse({
    adminNotes: formData.get("adminNotes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted field and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const notes = parsed.data.adminNotes || null;
  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: { adminNotes: notes },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorEmail: session.email,
        action: "BOOKING_ADMIN_NOTES_UPDATED",
        entityType: "Booking",
        entityId: bookingId,
        metadata: { hasNotes: Boolean(notes) },
      },
    }),
  ]);

  revalidateBookingViews(bookingId);
  return { ok: true, message: "Admin notes saved." };
}

const paymentSchema = z.object({
  amount: z.coerce
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than zero"),
  method: z.enum(["GCASH", "BANK_TRANSFER", "CASH", "CARD"]),
  reference: z.string().trim().min(2, "Reference is required").max(80),
  receivedAt: z.string().trim().min(1, "Received date is required"),
  notes: z.string().trim().max(500, "Notes must be under 500 characters").optional(),
});

export async function recordBookingPaymentAction(
  bookingId: string,
  _prev: PaymentActionState | undefined,
  formData: FormData,
): Promise<PaymentActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = paymentSchema.safeParse({
    amount: formData.get("amount") ?? "",
    method: formData.get("method") ?? "",
    reference: formData.get("reference") ?? "",
    receivedAt: formData.get("receivedAt") ?? "",
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const receivedAt = new Date(parsed.data.receivedAt);
  if (Number.isNaN(receivedAt.getTime())) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: { receivedAt: ["Enter a valid received date."] },
    };
  }

  const amount = new Prisma.Decimal(parsed.data.amount.toFixed(2));

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          reference: true,
          totalAmount: true,
          paidAmount: true,
          status: true,
        },
      });
      if (!booking) throw new Error("NOT_FOUND");
      if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
        throw new Error("TERMINAL_PAYMENT");
      }

      const balance = new Prisma.Decimal(booking.totalAmount).minus(
        booking.paidAmount,
      );
      if (amount.greaterThan(balance)) {
        throw new Error("OVERPAYMENT");
      }

      const nextPaid = new Prisma.Decimal(booking.paidAmount).add(amount);
      const paymentStatus = nextPaid.greaterThanOrEqualTo(booking.totalAmount)
        ? "PAID"
        : "PARTIALLY_PAID";

      await tx.payment.create({
        data: {
          bookingId,
          amount,
          method: parsed.data.method as PaymentMethod,
          reference: parsed.data.reference,
          receivedAt,
          proofUrl: null,
          proofPublicId: null,
          notes: parsed.data.notes || null,
          recordedById: session.userId,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          paidAmount: nextPaid,
          paymentStatus,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "BOOKING_PAYMENT_RECORDED",
          entityType: "Booking",
          entityId: bookingId,
          metadata: {
            reference: booking.reference,
            amount: amount.toString(),
            method: parsed.data.method,
            paymentStatus,
          } as Prisma.InputJsonValue,
        },
      });
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return { ok: false, message: "Booking not found." };
      }
      if (err.message === "TERMINAL_PAYMENT") {
        return {
          ok: false,
          message: "Payments cannot be recorded for rejected or cancelled bookings.",
        };
      }
      if (err.message === "OVERPAYMENT") {
        return {
          ok: false,
          message: "Payment amount cannot exceed the remaining balance.",
          errors: { amount: ["Amount cannot exceed the remaining balance."] },
        };
      }
    }
    throw err;
  }

  revalidateBookingViews(bookingId);
  revalidatePath("/admin/payments");
  return { ok: true, message: "Payment recorded." };
}

function revalidateBookingViews(bookingId: string) {
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/dashboard");
}
