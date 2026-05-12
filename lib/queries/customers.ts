import "server-only";
import { prisma } from "@/lib/prisma";

export type CustomerVerificationStatus =
  | "UNVERIFIED"
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "BLACKLISTED";

export interface Customer {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  facebookName?: string;
  address: string;
  verificationStatus: CustomerVerificationStatus;
  bookingsCount: number;
  totalSpent: number;
  joinedAt: string;
  lastBookingAt?: string;
  notes?: string;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface BookingAgg {
  count: number;
  paid: number;
  lastCreatedAt: Date | null;
}

async function aggregateBookings(): Promise<Map<string, BookingAgg>> {
  const rows = await prisma.booking.findMany({
    select: {
      customerId: true,
      paidAmount: true,
      createdAt: true,
    },
  });
  const agg = new Map<string, BookingAgg>();
  for (const r of rows) {
    const a = agg.get(r.customerId) ?? {
      count: 0,
      paid: 0,
      lastCreatedAt: null,
    };
    a.count += 1;
    a.paid += Number(r.paidAmount);
    if (!a.lastCreatedAt || r.createdAt > a.lastCreatedAt) {
      a.lastCreatedAt = r.createdAt;
    }
    agg.set(r.customerId, a);
  }
  return agg;
}

export async function getCustomers(): Promise<Customer[]> {
  const [rows, agg] = await Promise.all([
    prisma.customer.findMany({ orderBy: { joinedAt: "asc" } }),
    aggregateBookings(),
  ]);
  return rows.map((c) => {
    const a = agg.get(c.id);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      contactNumber: c.contactNumber,
      facebookName: c.facebookName ?? undefined,
      address: c.address,
      verificationStatus: c.verificationStatus as CustomerVerificationStatus,
      bookingsCount: a?.count ?? 0,
      totalSpent: a?.paid ?? 0,
      joinedAt: isoDate(c.joinedAt),
      lastBookingAt: a?.lastCreatedAt ? isoDate(a.lastCreatedAt) : undefined,
      notes: c.notes ?? undefined,
    };
  });
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const [row, agg] = await Promise.all([
    prisma.customer.findUnique({ where: { id } }),
    prisma.booking.findMany({
      where: { customerId: id },
      select: { paidAmount: true, createdAt: true },
    }),
  ]);
  if (!row) return null;

  const count = agg.length;
  const paid = agg.reduce((s, r) => s + Number(r.paidAmount), 0);
  const last = agg.reduce<Date | null>(
    (latest, r) =>
      !latest || r.createdAt > latest ? r.createdAt : latest,
    null,
  );

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    contactNumber: row.contactNumber,
    facebookName: row.facebookName ?? undefined,
    address: row.address,
    verificationStatus: row.verificationStatus as CustomerVerificationStatus,
    bookingsCount: count,
    totalSpent: paid,
    joinedAt: isoDate(row.joinedAt),
    lastBookingAt: last ? isoDate(last) : undefined,
    notes: row.notes ?? undefined,
  };
}
