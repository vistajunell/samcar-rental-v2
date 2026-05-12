import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
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
  const rows = await prisma.booking.groupBy({
    by: ["customerId"],
    _count: { _all: true },
    _sum: { paidAmount: true },
    _max: { createdAt: true },
  });
  const agg = new Map<string, BookingAgg>();
  for (const r of rows) {
    agg.set(r.customerId, {
      count: r._count._all,
      paid: Number(r._sum.paidAmount ?? 0),
      lastCreatedAt: r._max.createdAt,
    });
  }
  return agg;
}

const getCachedCustomers = unstable_cache(
  async () => {
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
  },
  ["admin-customers"],
  { tags: [CACHE_TAGS.customers], revalidate: 30 },
);

const getCachedCustomerById = unstable_cache(
  async (id: string) => {
    const [row, stats] = await Promise.all([
      prisma.customer.findUnique({ where: { id } }),
      prisma.booking.aggregate({
        where: { customerId: id },
        _count: { _all: true },
        _sum: { paidAmount: true },
        _max: { createdAt: true },
      }),
    ]);
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      contactNumber: row.contactNumber,
      facebookName: row.facebookName ?? undefined,
      address: row.address,
      verificationStatus: row.verificationStatus as CustomerVerificationStatus,
      bookingsCount: stats._count._all,
      totalSpent: Number(stats._sum.paidAmount ?? 0),
      joinedAt: isoDate(row.joinedAt),
      lastBookingAt: stats._max.createdAt ? isoDate(stats._max.createdAt) : undefined,
      notes: row.notes ?? undefined,
    };
  },
  ["admin-customer-by-id"],
  { tags: [CACHE_TAGS.customers], revalidate: 30 },
);

export async function getCustomers(): Promise<Customer[]> {
  return getCachedCustomers();
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  return getCachedCustomerById(id);
}
