import "server-only";
import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@/lib/queries/bookings";

export interface AdminInvoice {
  id: string;
  number: string;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  carLabel: string;
  rentalStart: string;
  rentalEnd: string;
  pickupAddress: string;
  dropoffAddress: string;
  subtotal: number;
  driverFee: number;
  total: number;
  paid: number;
  balance: number;
  paymentStatus: PaymentStatus;
  issuedAt: string;
  dueDate: string;
  notes?: string;
}

const invoiceInclude = {
  booking: { select: { reference: true } },
} as const;

type InvoiceRow = {
  id: string;
  number: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  carLabel: string;
  rentalStart: Date;
  rentalEnd: Date;
  pickupAddress: string;
  dropoffAddress: string;
  subtotal: { toString(): string };
  driverFee: { toString(): string };
  total: { toString(): string };
  paid: { toString(): string };
  balance: { toString(): string };
  paymentStatus: string;
  issuedAt: Date;
  dueDate: Date;
  notes: string | null;
  booking: { reference: string };
};

function toView(i: InvoiceRow): AdminInvoice {
  return {
    id: i.id,
    number: i.number,
    bookingId: i.bookingId,
    bookingReference: i.booking.reference,
    customerName: i.customerName,
    customerEmail: i.customerEmail,
    carLabel: i.carLabel,
    rentalStart: i.rentalStart.toISOString(),
    rentalEnd: i.rentalEnd.toISOString(),
    pickupAddress: i.pickupAddress,
    dropoffAddress: i.dropoffAddress,
    subtotal: Number(i.subtotal),
    driverFee: Number(i.driverFee),
    total: Number(i.total),
    paid: Number(i.paid),
    balance: Number(i.balance),
    paymentStatus: i.paymentStatus as PaymentStatus,
    issuedAt: i.issuedAt.toISOString(),
    dueDate: i.dueDate.toISOString(),
    notes: i.notes ?? undefined,
  };
}

export async function getInvoices(): Promise<AdminInvoice[]> {
  const rows = await prisma.invoice.findMany({
    include: invoiceInclude,
    orderBy: { issuedAt: "desc" },
  });
  return rows.map(toView);
}

export async function getInvoiceById(
  id: string,
): Promise<AdminInvoice | null> {
  const row = await prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });
  return row ? toView(row) : null;
}
