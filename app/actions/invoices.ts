"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/session";
import { invalidateCacheTags } from "@/lib/admin/invalidate-cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type InvoiceActionState = {
  ok: boolean;
  message?: string;
};

function generateInvoiceNumber() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `INV-${yyyy}${mm}${dd}-${suffix}`;
}

export async function generateInvoiceForBookingAction(
  bookingId: string,
  _prev?: InvoiceActionState,
  _formData?: FormData,
): Promise<InvoiceActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: { select: { name: true, email: true } },
          car: { select: { brand: true, name: true, year: true } },
          invoice: { select: { id: true } },
        },
      });

      if (!booking) throw new Error("NOT_FOUND");
      if (booking.invoice) return booking.invoice;
      if (booking.status !== "APPROVED" && booking.status !== "COMPLETED") {
        throw new Error("INVALID_STATUS");
      }

      const subtotal = new Prisma.Decimal(booking.totalAmount);
      const driverFee = new Prisma.Decimal(0);
      const total = subtotal.add(driverFee);
      const paid = new Prisma.Decimal(booking.paidAmount);
      const balance = total.minus(paid);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      let created: { id: string } | null = null;
      let attempt = 0;
      while (!created && attempt < 5) {
        try {
          created = await tx.invoice.create({
            data: {
              number: generateInvoiceNumber(),
              bookingId: booking.id,
              customerName: booking.customer.name,
              customerEmail: booking.customer.email,
              carLabel: `${booking.car.brand} ${booking.car.name} ${booking.car.year}`,
              rentalStart: booking.startDateTime,
              rentalEnd: booking.endDateTime,
              pickupAddress: booking.pickupAddress,
              dropoffAddress: booking.dropoffAddress,
              subtotal,
              driverFee,
              total,
              paid,
              balance,
              paymentStatus: booking.paymentStatus,
              dueDate,
              notes: booking.adminNotes,
            },
            select: { id: true },
          });
        } catch (err) {
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
          ) {
            attempt += 1;
            continue;
          }
          throw err;
        }
      }

      if (!created) throw new Error("NUMBER_FAILED");

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "INVOICE_GENERATED",
          entityType: "Invoice",
          entityId: created.id,
          metadata: {
            bookingId: booking.id,
            reference: booking.reference,
            total: total.toString(),
            balance: balance.toString(),
          } as Prisma.InputJsonValue,
        },
      });

      return created;
    });

    revalidateInvoiceViews(bookingId, invoice.id);
    redirect(`/admin/invoices/${invoice.id}`);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return { ok: false, message: "Booking not found." };
      }
      if (err.message === "INVALID_STATUS") {
        return {
          ok: false,
          message: "Only approved or completed bookings can generate invoices.",
        };
      }
      if (err.message === "NUMBER_FAILED") {
        return {
          ok: false,
          message: "Could not assign an invoice number. Please try again.",
        };
      }
    }
    throw err;
  }
}

function revalidateInvoiceViews(bookingId: string, invoiceId: string) {
  invalidateCacheTags(CACHE_TAGS.invoices, CACHE_TAGS.bookings, CACHE_TAGS.dashboard);
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/dashboard");
}
