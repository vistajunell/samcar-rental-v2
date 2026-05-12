import "server-only";
import { unstable_cache } from "next/cache";
import type { CarStatus as PrismaCarStatus, Prisma } from "@prisma/client";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type CarStatus =
  | "Draft"
  | "Confirmed Available"
  | "Published"
  | "Reserved"
  | "Unavailable"
  | "Archived";
export type CarTransmission = "Automatic" | "Manual";
export type CarFuelType = "Gasoline" | "Diesel" | "Hybrid" | "Electric" | "Other";

export interface CarUIView {
  id: string;
  slug: string;
  name: string;
  brand: string;
  year: number;
  category: string;
  tagline?: string;
  image: string;
  status: CarStatus;
  statusRaw: PrismaCarStatus;
  isPublic: boolean;
  seats: number;
  transmission: CarTransmission;
  fuelType: CarFuelType;
  pricePerDay: number;
  /** ISO date (YYYY-MM-DD) — partner-confirmed availability window start. */
  availableFrom: string;
  /** ISO date (YYYY-MM-DD) — partner-confirmed availability window end. */
  availableTo: string;
  partnerId?: string;
  partnerName?: string;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function transmissionLabel(t: "AUTOMATIC" | "MANUAL"): CarTransmission {
  return t === "AUTOMATIC" ? "Automatic" : "Manual";
}

function fuelLabel(f: string): CarFuelType {
  switch (f) {
    case "GASOLINE":
      return "Gasoline";
    case "DIESEL":
      return "Diesel";
    case "HYBRID":
      return "Hybrid";
    case "ELECTRIC":
      return "Electric";
    default:
      return "Other";
  }
}

function statusLabel(status: string, isPublic: boolean): CarStatus {
  if (status === "DRAFT") return "Draft";
  if (status === "PUBLISHED" && isPublic) return "Confirmed Available";
  if (status === "PUBLISHED") return "Published";
  if (status === "CONFIRMED_AVAILABLE") return "Confirmed Available";
  if (status === "UNAVAILABLE") return "Unavailable";
  if (status === "ARCHIVED") return "Archived";
  return "Unavailable";
}

type CarRow = Awaited<ReturnType<typeof loadCarRows>>[number];

async function loadCarRows(opts: { id?: string; slug?: string; publicOnly?: boolean } = {}) {
  const where: Prisma.CarWhereInput = {};
  if (opts.id) where.id = opts.id;
  if (opts.slug) where.slug = opts.slug;
  if (opts.publicOnly) {
    where.status = "PUBLISHED";
    where.isPublic = true;
  }
  return prisma.car.findMany({
    where,
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
      availability: { orderBy: { from: "asc" } },
      partner: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

function toView(car: CarRow): CarUIView {
  const primary =
    (car.primaryImage && car.primaryImage.length > 0
      ? car.primaryImage
      : null) ||
    car.images.find((i) => i.isPrimary)?.url ||
    car.images[0]?.url ||
    "";

  const first = car.availability[0];
  const last = car.availability[car.availability.length - 1];
  const availableFrom = first ? isoDate(first.from) : "";
  const availableTo = last ? isoDate(last.to) : "";

  return {
    id: car.id,
    slug: car.slug,
    name: car.name,
    brand: car.brand,
    year: car.year,
    category: car.category,
    tagline: car.tagline ?? undefined,
    image: primary,
    status: statusLabel(car.status, car.isPublic),
    statusRaw: car.status,
    isPublic: car.isPublic,
    seats: car.seats,
    transmission: transmissionLabel(car.transmission),
    fuelType: fuelLabel(car.fuelType),
    pricePerDay: Number(car.pricePerDay),
    availableFrom,
    availableTo,
    partnerId: car.partner?.id ?? undefined,
    partnerName: car.partner?.name ?? undefined,
  };
}

/** Cars to feature in the hero carousel. Mirrors the public list. */
export async function getCarsForCarousel(): Promise<CarUIView[]> {
  return getPublishedCars();
}

const getCachedPublishedCars = unstable_cache(
  async () => {
    const rows = await loadCarRows({ publicOnly: true });
    return rows.map(toView);
  },
  ["published-cars"],
  { tags: [CACHE_TAGS.publicCars], revalidate: 60 },
);

const getCachedAdminCars = unstable_cache(
  async () => {
    const rows = await loadCarRows();
    return rows.map(toView);
  },
  ["admin-cars"],
  { tags: [CACHE_TAGS.adminCars], revalidate: 30 },
);

const getCachedAdminCarById = unstable_cache(
  async (id: string) => {
    const rows = await loadCarRows({ id });
    const car = rows[0];
    return car ? toView(car) : null;
  },
  ["admin-car-by-id"],
  { tags: [CACHE_TAGS.adminCars], revalidate: 30 },
);

const getCachedCarBySlug = unstable_cache(
  async (slug: string) => {
    const rows = await loadCarRows({ slug, publicOnly: true });
    const car = rows[0];
    return car ? toView(car) : null;
  },
  ["public-car-by-slug"],
  { tags: [CACHE_TAGS.publicCars], revalidate: 60 },
);

/**
 * Public-facing list. Only cars marked PUBLISHED + isPublic=true are
 * surfaced to customers.
 */
export async function getPublishedCars(): Promise<CarUIView[]> {
  return getCachedPublishedCars();
}

/** Admin inventory list. Includes drafts, hidden units, unavailable cars, and archived records. */
export async function getAdminCars(): Promise<CarUIView[]> {
  return getCachedAdminCars();
}

export async function getAdminCarById(id: string): Promise<CarUIView | null> {
  return getCachedAdminCarById(id);
}

/** Looks up a single car by slug, but only if it is publicly visible. */
export async function getCarBySlug(slug: string): Promise<CarUIView | null> {
  return getCachedCarBySlug(slug);
}
