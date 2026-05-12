import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface Partner {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  facebook?: string;
  address: string;
  commissionPct: number;
  carIds: string[];
  notes?: string;
  joinedAt: string;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type PartnerRow = Prisma.PartnerGetPayload<{
  include: { cars: { select: { id: true } } };
}>;

function toView(p: PartnerRow): Partner {
  return {
    id: p.id,
    name: p.name,
    contactNumber: p.contactNumber,
    email: p.email,
    facebook: p.facebook ?? undefined,
    address: p.address,
    commissionPct: Number(p.commissionPct),
    carIds: p.cars.map((c) => c.id),
    notes: p.notes ?? undefined,
    joinedAt: isoDate(p.joinedAt),
  };
}

export async function getPartners(): Promise<Partner[]> {
  const rows = await prisma.partner.findMany({
    include: { cars: { select: { id: true } } },
    orderBy: { joinedAt: "asc" },
  });
  return rows.map(toView);
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  const row = await prisma.partner.findUnique({
    where: { id },
    include: { cars: { select: { id: true } } },
  });
  return row ? toView(row) : null;
}

export async function getPartnerForCar(
  carId: string,
): Promise<Partner | null> {
  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { partnerId: true },
  });
  if (!car?.partnerId) return null;
  return getPartnerById(car.partnerId);
}
