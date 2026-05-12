"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { bookingSchema } from "@/lib/validation/booking";
import { prisma } from "@/lib/prisma";

export type BookingActionState = {
  ok: boolean;
  /** Field-level errors keyed by form field name. */
  errors?: Record<string, string[]>;
  /** Top-level message — shown above the form when set. */
  message?: string;
  /** Echo back the user's most recent values so the form can rehydrate. */
  values?: Record<string, string>;
};

const REQUIRED_FILE_FIELDS = [
  { name: "governmentId1", label: "Government ID 1", type: "GOVERNMENT_ID_1" as const },
  { name: "governmentId2", label: "Government ID 2", type: "GOVERNMENT_ID_2" as const },
  { name: "selfieWithId", label: "Selfie holding valid ID", type: "SELFIE_WITH_ID" as const },
  { name: "proofOfBilling", label: "Recent proof of billing", type: "PROOF_OF_BILLING" as const },
] as const;

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per file
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];

function generateReference(): string {
  const date = new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SCR-${yyyy}${mm}${dd}-${suffix}`;
}

function collectStringValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

function computeDurationDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export async function createPendingBookingAction(
  _prev: BookingActionState | undefined,
  formData: FormData,
): Promise<BookingActionState> {
  const values = collectStringValues(formData);

  /* 1. Validate text fields with Zod. */
  const parsed = bookingSchema.safeParse({
    fullName: values.fullName ?? "",
    contactNumber: values.contactNumber ?? "",
    email: values.email ?? "",
    residentialAddress: values.residentialAddress ?? "",
    startDateTime: values.startDateTime ?? "",
    endDateTime: values.endDateTime ?? "",
    purpose: values.purpose ?? "",
    destination: values.destination ?? "",
    withDriver: values.withDriver ?? "",
    carSlug: values.carSlug ?? "",
    passengers: values.passengers ?? "",
    pickupAddress: values.pickupAddress ?? "",
    dropoffAddress: values.dropoffAddress ?? "",
    facebookName: values.facebookName ?? "",
    notes: values.notes ?? "",
  });

  const errors: Record<string, string[]> = {};

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    for (const [field, msgs] of Object.entries(flat.fieldErrors)) {
      if (msgs && msgs.length) errors[field] = msgs;
    }
  }

  /* 2. Resolve the selected car against the DB. Must be PUBLISHED + public. */
  let car: {
    id: string;
    pricePerDay: Prisma.Decimal;
  } | null = null;
  if (parsed.success) {
    car = await prisma.car.findFirst({
      where: {
        slug: parsed.data.carSlug,
        status: "PUBLISHED",
        isPublic: true,
      },
      select: { id: true, pricePerDay: true },
    });
    if (!car) {
      errors.carSlug = [
        "The selected car is no longer publicly available. Please pick another.",
      ];
    }
  }

  /* 3. Validate the four required uploads. We persist metadata only — the
        actual file bytes still need a Cloudinary path (Phase 4 follow-up). */
  const fileBlobs: Record<string, File> = {};
  for (const file of REQUIRED_FILE_FIELDS) {
    const candidate = formData.get(file.name);
    if (!(candidate instanceof File) || candidate.size === 0) {
      errors[file.name] = [`${file.label} is required.`];
      continue;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      errors[file.name] = [`${file.label} must be 8 MB or smaller.`];
      continue;
    }
    const type = candidate.type || "";
    if (!ALLOWED_MIME_PREFIXES.some((p) => type.startsWith(p))) {
      errors[file.name] = [
        `${file.label} must be an image (JPG/PNG/HEIC) or PDF.`,
      ];
      continue;
    }
    fileBlobs[file.name] = candidate;
  }

  if (Object.keys(errors).length > 0 || !parsed.success || !car) {
    return {
      ok: false,
      errors,
      message: "Please fix the highlighted fields and try again.",
      values,
    };
  }

  /* 4. Persist customer + booking + document metadata. */
  const data = parsed.data;
  const start = new Date(data.startDateTime);
  const end = new Date(data.endDateTime);
  const durationDays = computeDurationDays(start, end);
  const total = new Prisma.Decimal(car.pricePerDay).mul(durationDays);

  const normalizedEmail = data.email.toLowerCase();
  const existingCustomer = await prisma.customer.findUnique({
    where: { email: normalizedEmail },
    select: { verificationStatus: true },
  });

  if (existingCustomer?.verificationStatus === "BLACKLISTED") {
    return {
      ok: false,
      message: "Please contact SamCar directly to continue with this booking request.",
      errors: { email: ["Please contact SamCar before booking with this email."] },
      values,
    };
  }

  const customer = await prisma.customer.upsert({
    where: { email: normalizedEmail },
    update: {
      name: data.fullName,
      contactNumber: data.contactNumber,
      facebookName: data.facebookName?.trim() || null,
      address: data.residentialAddress,
    },
    create: {
      name: data.fullName,
      email: normalizedEmail,
      contactNumber: data.contactNumber,
      facebookName: data.facebookName?.trim() || null,
      address: data.residentialAddress,
    },
  });

  let reference = generateReference();
  // Retry once if a collision sneaks in (the @unique index will reject dups).
  let attempt = 0;
  let booking: { id: string; reference: string } | null = null;
  while (!booking && attempt < 5) {
    try {
      booking = await prisma.booking.create({
        data: {
          reference,
          customerId: customer.id,
          carId: car.id,
          startDateTime: start,
          endDateTime: end,
          durationDays,
          purpose: data.purpose,
          destination: data.destination,
          withDriver: data.withDriver === "yes",
          passengers: data.passengers,
          pickupAddress: data.pickupAddress,
          dropoffAddress: data.dropoffAddress,
          facebookName: data.facebookName?.trim() || null,
          notes: data.notes?.trim() || null,
          status: "PENDING_VERIFICATION",
          paymentStatus: "UNPAID",
          totalAmount: total,
          paidAmount: new Prisma.Decimal(0),
        },
        select: { id: true, reference: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        attempt += 1;
        reference = generateReference();
        continue;
      }
      throw err;
    }
  }

  if (!booking) {
    return {
      ok: false,
      message: "Could not assign a booking reference. Please try again.",
      values,
    };
  }

  await prisma.bookingDocument.createMany({
    data: REQUIRED_FILE_FIELDS.filter((f) => fileBlobs[f.name]).map((f) => {
      const blob = fileBlobs[f.name]!;
      return {
        bookingId: booking!.id,
        type: f.type,
        // Cloudinary upload is deferred — record the metadata so the admin
        // UI can list the document, and replace `url` once uploads land.
        url: `mock://documents/${booking!.id}/${blob.name}`,
        publicId: null,
        filename: blob.name,
        mimeType: blob.type || "application/octet-stream",
        size: blob.size,
      };
    }),
  });

  const params = new URLSearchParams({
    ref: booking.reference,
    name: data.fullName,
    car: data.carSlug,
  });
  redirect(`/booking-success?${params.toString()}`);
}
