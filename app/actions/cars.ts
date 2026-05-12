"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, type CarStatus, type FuelType, type TransmissionType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/session";

export type CarFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const carSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by dashes"),
  brand: z.string().trim().min(1, "Brand is required").max(80),
  name: z.string().trim().min(1, "Model/name is required").max(120),
  year: z.coerce.number().int().min(1990).max(2100),
  category: z.string().trim().min(1, "Category is required").max(80),
  tagline: z.string().trim().max(180).optional(),
  seats: z.coerce.number().int().min(1).max(30),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  fuelType: z.enum(["GASOLINE", "DIESEL", "HYBRID", "ELECTRIC", "OTHER"]),
  pricePerDay: z.coerce.number().positive("Price must be greater than zero"),
  status: z.enum(["DRAFT", "CONFIRMED_AVAILABLE", "PUBLISHED", "UNAVAILABLE", "ARCHIVED"]),
  isPublic: z.enum(["true", "false"]),
  partnerId: z.string().trim().optional(),
  primaryImage: z
    .string()
    .trim()
    .min(1, "Primary image is required")
    .max(1_100_000, "Choose a smaller image or use an existing optimized image."),
  availableFrom: z.string().trim().min(1, "Available from date is required"),
  availableTo: z.string().trim().min(1, "Available to date is required"),
  availabilityNotes: z.string().trim().max(500).optional(),
});

function parseDate(value: string): Date | null {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeStatus(status: CarStatus, isPublic: boolean) {
  if (status === "PUBLISHED" && !isPublic) {
    return { status: "CONFIRMED_AVAILABLE" as CarStatus, isPublic: false };
  }
  if (status !== "PUBLISHED" && isPublic) {
    return { status: "PUBLISHED" as CarStatus, isPublic: true };
  }
  if (status === "ARCHIVED" || status === "UNAVAILABLE" || status === "DRAFT") {
    return { status, isPublic: false };
  }
  return { status, isPublic };
}

function parseCarForm(formData: FormData) {
  const parsed = carSchema.safeParse({
    slug: formData.get("slug") ?? "",
    brand: formData.get("brand") ?? "",
    name: formData.get("name") ?? "",
    year: formData.get("year") ?? "",
    category: formData.get("category") ?? "",
    tagline: formData.get("tagline") ?? "",
    seats: formData.get("seats") ?? "",
    transmission: formData.get("transmission") ?? "",
    fuelType: formData.get("fuelType") ?? "",
    pricePerDay: formData.get("pricePerDay") ?? "",
    status: formData.get("status") ?? "",
    isPublic: formData.get("isPublic") ?? "false",
    partnerId: formData.get("partnerId") ?? "",
    primaryImage: formData.get("primaryImage") ?? "",
    availableFrom: formData.get("availableFrom") ?? "",
    availableTo: formData.get("availableTo") ?? "",
    availabilityNotes: formData.get("availabilityNotes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const from = parseDate(parsed.data.availableFrom);
  const to = parseDate(parsed.data.availableTo);
  const errors: Record<string, string[]> = {};
  if (!from) errors.availableFrom = ["Enter a valid date."];
  if (!to) errors.availableTo = ["Enter a valid date."];
  if (from && to && to < from) {
    errors.availableTo = ["Available to must be after available from."];
  }
  if (Object.keys(errors).length > 0 || !from || !to) {
    return { ok: false as const, errors };
  }

  const visibility = normalizeStatus(
    parsed.data.status as CarStatus,
    parsed.data.isPublic === "true",
  );

  return {
    ok: true as const,
    data: {
      ...parsed.data,
      tagline: parsed.data.tagline || null,
      partnerId: parsed.data.partnerId || null,
      pricePerDay: new Prisma.Decimal(parsed.data.pricePerDay.toFixed(2)),
      transmission: parsed.data.transmission as TransmissionType,
      fuelType: parsed.data.fuelType as FuelType,
      status: visibility.status,
      isPublic: visibility.isPublic,
      from,
      to,
      availabilityNotes: parsed.data.availabilityNotes || null,
    },
  };
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function createCarAction(
  _prev: CarFormState | undefined,
  formData: FormData,
): Promise<CarFormState> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Your admin session expired. Please sign in again." };

  const parsed = parseCarForm(formData);
  if (!parsed.ok) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.errors,
    };
  }

  try {
    const car = await prisma.$transaction(async (tx) => {
      const created = await tx.car.create({
        data: {
          slug: parsed.data.slug,
          brand: parsed.data.brand,
          name: parsed.data.name,
          year: parsed.data.year,
          category: parsed.data.category,
          tagline: parsed.data.tagline,
          seats: parsed.data.seats,
          transmission: parsed.data.transmission,
          fuelType: parsed.data.fuelType,
          pricePerDay: parsed.data.pricePerDay,
          status: parsed.data.status,
          isPublic: parsed.data.isPublic,
          partnerId: parsed.data.partnerId,
          primaryImage: parsed.data.primaryImage,
          images: {
            create: {
              url: parsed.data.primaryImage,
              isPrimary: true,
              position: 0,
            },
          },
          availability: {
            create: {
              from: parsed.data.from,
              to: parsed.data.to,
              notes: parsed.data.availabilityNotes,
            },
          },
        },
        select: { id: true, slug: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "CAR_CREATED",
          entityType: "Car",
          entityId: created.id,
          metadata: { slug: created.slug },
        },
      });

      return created;
    });

    revalidateCarViews(car.id);
    redirect(`/admin/cars/${car.id}`);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "That slug is already used by another car.",
        errors: { slug: ["Use a unique slug."] },
      };
    }
    throw err;
  }
}

export async function updateCarAction(
  carId: string,
  _prev: CarFormState | undefined,
  formData: FormData,
): Promise<CarFormState> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Your admin session expired. Please sign in again." };

  const parsed = parseCarForm(formData);
  if (!parsed.ok) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.errors,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.car.update({
        where: { id: carId },
        data: {
          slug: parsed.data.slug,
          brand: parsed.data.brand,
          name: parsed.data.name,
          year: parsed.data.year,
          category: parsed.data.category,
          tagline: parsed.data.tagline,
          seats: parsed.data.seats,
          transmission: parsed.data.transmission,
          fuelType: parsed.data.fuelType,
          pricePerDay: parsed.data.pricePerDay,
          status: parsed.data.status,
          isPublic: parsed.data.isPublic,
          partnerId: parsed.data.partnerId,
          primaryImage: parsed.data.primaryImage,
        },
      });

      await tx.carImage.deleteMany({ where: { carId } });
      await tx.carImage.create({
        data: {
          carId,
          url: parsed.data.primaryImage,
          isPrimary: true,
          position: 0,
        },
      });

      await tx.carAvailability.deleteMany({ where: { carId } });
      await tx.carAvailability.create({
        data: {
          carId,
          from: parsed.data.from,
          to: parsed.data.to,
          notes: parsed.data.availabilityNotes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "CAR_UPDATED",
          entityType: "Car",
          entityId: carId,
          metadata: {
            slug: parsed.data.slug,
            status: parsed.data.status,
            isPublic: parsed.data.isPublic,
          },
        },
      });
    });

    revalidateCarViews(carId);
    return { ok: true, message: "Car details saved." };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "That slug is already used by another car.",
        errors: { slug: ["Use a unique slug."] },
      };
    }
    throw err;
  }
}

export async function publishCarAction(carId: string) {
  return updateCarVisibility(carId, "PUBLISHED", true, "CAR_PUBLISHED");
}

export async function unpublishCarAction(carId: string) {
  return updateCarVisibility(carId, "CONFIRMED_AVAILABLE", false, "CAR_UNPUBLISHED");
}

export async function markCarUnavailableAction(carId: string) {
  return updateCarVisibility(carId, "UNAVAILABLE", false, "CAR_MARKED_UNAVAILABLE");
}

export async function archiveCarAction(carId: string) {
  return updateCarVisibility(carId, "ARCHIVED", false, "CAR_ARCHIVED");
}

async function updateCarVisibility(
  carId: string,
  status: CarStatus,
  isPublic: boolean,
  auditAction: string,
) {
  const session = await requireAdmin();
  await prisma.$transaction([
    prisma.car.update({
      where: { id: carId },
      data: { status, isPublic },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorEmail: session.email,
        action: auditAction,
        entityType: "Car",
        entityId: carId,
        metadata: { status, isPublic },
      },
    }),
  ]);
  revalidateCarViews(carId);
}

function revalidateCarViews(carId: string) {
  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/book");
  revalidatePath("/admin/cars");
  revalidatePath(`/admin/cars/${carId}`);
  revalidatePath("/admin/dashboard");
}
