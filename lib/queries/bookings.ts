import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type BookingStatus =
  | "PENDING_VERIFICATION"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "REFUNDED";

export interface BookingDocumentRef {
  /** Display label for the document type. */
  label: string;
  /** Original filename as supplied by the customer. */
  filename: string;
  /** Human-readable size, e.g. "1.2 MB". */
  size: string;
}

export interface AdminBooking {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  carId: string;
  carSlug: string;
  carLabel: string;
  partnerId?: string;
  startDateTime: string;
  endDateTime: string;
  durationDays: number;
  purpose: string;
  destination: string;
  withDriver: boolean;
  passengers: number;
  pickupAddress: string;
  dropoffAddress: string;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  documents: BookingDocumentRef[];
  adminNotes?: string;
}

const DOC_LABEL: Record<string, string> = {
  GOVERNMENT_ID_1: "Government ID 1",
  GOVERNMENT_ID_2: "Government ID 2",
  SELFIE_WITH_ID: "Selfie with ID",
  PROOF_OF_BILLING: "Proof of Billing",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const bookingInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
      contactNumber: true,
    },
  },
  car: {
    select: {
      id: true,
      slug: true,
      brand: true,
      name: true,
      year: true,
      partnerId: true,
    },
  },
  documents: true,
} as const;

type BookingRow = {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  startDateTime: Date;
  endDateTime: Date;
  durationDays: number;
  purpose: string;
  destination: string;
  withDriver: boolean;
  passengers: number;
  pickupAddress: string;
  dropoffAddress: string;
  notes: string | null;
  adminNotes: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: { toString(): string };
  paidAmount: { toString(): string };
  createdAt: Date;
  customer: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
  };
  car: {
    id: string;
    slug: string;
    brand: string;
    name: string;
    year: number;
    partnerId: string | null;
  };
  documents: Array<{
    type: string;
    filename: string;
    size: number;
  }>;
};

function toView(b: BookingRow): AdminBooking {
  return {
    id: b.id,
    reference: b.reference,
    customerId: b.customerId,
    customerName: b.customer.name,
    customerEmail: b.customer.email,
    customerContact: b.customer.contactNumber,
    carId: b.carId,
    carSlug: b.car.slug,
    carLabel: `${b.car.brand} ${b.car.name} ${b.car.year}`,
    partnerId: b.car.partnerId ?? undefined,
    startDateTime: b.startDateTime.toISOString(),
    endDateTime: b.endDateTime.toISOString(),
    durationDays: b.durationDays,
    purpose: b.purpose,
    destination: b.destination,
    withDriver: b.withDriver,
    passengers: b.passengers,
    pickupAddress: b.pickupAddress,
    dropoffAddress: b.dropoffAddress,
    notes: b.notes ?? undefined,
    status: b.status as BookingStatus,
    paymentStatus: b.paymentStatus as PaymentStatus,
    totalAmount: Number(b.totalAmount),
    paidAmount: Number(b.paidAmount),
    createdAt: b.createdAt.toISOString(),
    documents: b.documents.map((d) => ({
      label: DOC_LABEL[d.type] ?? d.type,
      filename: d.filename,
      size: formatSize(d.size),
    })),
    adminNotes: b.adminNotes ?? undefined,
  };
}

const getCachedBookings = unstable_cache(
  async () => {
    const rows = await prisma.booking.findMany({
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },
  ["admin-bookings"],
  { tags: [CACHE_TAGS.bookings], revalidate: 20 },
);

const getCachedBookingById = unstable_cache(
  async (id: string) => {
    const row = await prisma.booking.findUnique({
      where: { id },
      include: bookingInclude,
    });
    return row ? toView(row) : null;
  },
  ["admin-booking-by-id"],
  { tags: [CACHE_TAGS.bookings], revalidate: 20 },
);

const getCachedRecentBookings = unstable_cache(
  async (limit = 5) => {
    const rows = await prisma.booking.findMany({
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(toView);
  },
  ["admin-recent-bookings"],
  { tags: [CACHE_TAGS.bookings, CACHE_TAGS.dashboard], revalidate: 20 },
);

const getCachedBookingsByCustomer = unstable_cache(
  async (customerId: string) => {
    const rows = await prisma.booking.findMany({
      where: { customerId },
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },
  ["admin-bookings-by-customer"],
  { tags: [CACHE_TAGS.bookings, CACHE_TAGS.customers], revalidate: 20 },
);

const getCachedBookingsByCar = unstable_cache(
  async (carId: string) => {
    const rows = await prisma.booking.findMany({
      where: { carId },
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toView);
  },
  ["admin-bookings-by-car"],
  { tags: [CACHE_TAGS.bookings, CACHE_TAGS.adminCars], revalidate: 20 },
);

const getCachedDashboardStats = unstable_cache(
  async () => {
    const [statusGroups, paymentAgg, outstandingAgg] = await Promise.all([
      prisma.booking.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.booking.aggregate({
        where: { NOT: { paymentStatus: "REFUNDED" } },
        _sum: { paidAmount: true },
      }),
      prisma.booking.aggregate({
        where: { status: { in: ["APPROVED", "UNDER_REVIEW"] } },
        _sum: { totalAmount: true, paidAmount: true },
      }),
    ]);

    const counts: Record<string, number> = {};
    let totalBookings = 0;
    for (const g of statusGroups) {
      counts[g.status] = g._count._all;
      totalBookings += g._count._all;
    }

    const outstanding =
      Number(outstandingAgg._sum.totalAmount ?? 0) -
      Number(outstandingAgg._sum.paidAmount ?? 0);

    return {
      totalBookings,
      pendingVerification: counts["PENDING_VERIFICATION"] ?? 0,
      underReview: counts["UNDER_REVIEW"] ?? 0,
      approved: counts["APPROVED"] ?? 0,
      completed: counts["COMPLETED"] ?? 0,
      revenue: Number(paymentAgg._sum.paidAmount ?? 0),
      outstanding,
    };
  },
  ["admin-dashboard-stats"],
  { tags: [CACHE_TAGS.dashboard, CACHE_TAGS.bookings], revalidate: 20 },
);

export async function getBookings(): Promise<AdminBooking[]> {
  return getCachedBookings();
}

export async function getBookingById(id: string): Promise<AdminBooking | null> {
  return getCachedBookingById(id);
}

export async function getRecentBookings(limit = 5): Promise<AdminBooking[]> {
  return getCachedRecentBookings(limit);
}

export async function getBookingsByCustomer(
  customerId: string,
): Promise<AdminBooking[]> {
  return getCachedBookingsByCustomer(customerId);
}

export async function getBookingsByCar(
  carId: string,
): Promise<AdminBooking[]> {
  return getCachedBookingsByCar(carId);
}

export async function getDashboardStats() {
  return getCachedDashboardStats();
}
