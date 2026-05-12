import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type PaymentMethod = "GCASH" | "BANK_TRANSFER" | "CASH" | "CARD";

export interface AdminPayment {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  receivedAt: string;
  proofFilename?: string;
  notes?: string;
}

const paymentInclude = {
  booking: {
    select: {
      reference: true,
      customer: { select: { name: true } },
    },
  },
} as const;

type PaymentRow = {
  id: string;
  bookingId: string;
  amount: { toString(): string };
  method: string;
  reference: string;
  receivedAt: Date;
  proofUrl: string | null;
  notes: string | null;
  booking: {
    reference: string;
    customer: { name: string };
  };
};

function filenameFromUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  const tail = url.split(/[\\/]/).pop();
  return tail || undefined;
}

function toView(p: PaymentRow): AdminPayment {
  return {
    id: p.id,
    bookingId: p.bookingId,
    bookingReference: p.booking.reference,
    customerName: p.booking.customer.name,
    amount: Number(p.amount),
    method: p.method as PaymentMethod,
    reference: p.reference,
    receivedAt: p.receivedAt.toISOString(),
    proofFilename: filenameFromUrl(p.proofUrl),
    notes: p.notes ?? undefined,
  };
}

const getCachedPayments = unstable_cache(
  async () => {
    const rows = await prisma.payment.findMany({
      include: paymentInclude,
      orderBy: { receivedAt: "desc" },
    });
    return rows.map(toView);
  },
  ["admin-payments"],
  { tags: [CACHE_TAGS.payments], revalidate: 30 },
);

const getCachedPaymentsForBooking = unstable_cache(
  async (bookingId: string) => {
    const rows = await prisma.payment.findMany({
      where: { bookingId },
      include: paymentInclude,
      orderBy: { receivedAt: "desc" },
    });
    return rows.map(toView);
  },
  ["admin-payments-for-booking"],
  { tags: [CACHE_TAGS.payments, CACHE_TAGS.bookings], revalidate: 30 },
);

export async function getPayments(): Promise<AdminPayment[]> {
  return getCachedPayments();
}

export async function getPaymentsForBooking(
  bookingId: string,
): Promise<AdminPayment[]> {
  return getCachedPaymentsForBooking(bookingId);
}
