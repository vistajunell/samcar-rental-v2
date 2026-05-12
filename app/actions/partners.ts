"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin/session";
import { invalidateCacheTags } from "@/lib/admin/invalidate-cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type PartnerFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Partner name is required").max(120),
  contactNumber: z.string().trim().min(5, "Contact number is required").max(40),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(160),
  facebook: z.string().trim().max(160).optional(),
  address: z.string().trim().min(5, "Address is required").max(240),
  commissionPct: z.coerce
    .number()
    .min(0, "Commission cannot be negative")
    .max(100, "Commission cannot exceed 100%"),
  notes: z.string().trim().max(1000).optional(),
});

function parsePartnerForm(formData: FormData) {
  const parsed = partnerSchema.safeParse({
    name: formData.get("name") ?? "",
    contactNumber: formData.get("contactNumber") ?? "",
    email: formData.get("email") ?? "",
    facebook: formData.get("facebook") ?? "",
    address: formData.get("address") ?? "",
    commissionPct: formData.get("commissionPct") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    ok: true as const,
    data: {
      ...parsed.data,
      facebook: parsed.data.facebook || null,
      notes: parsed.data.notes || null,
      commissionPct: new Prisma.Decimal(parsed.data.commissionPct.toFixed(2)),
    },
  };
}

export async function createPartnerAction(
  _prev: PartnerFormState | undefined,
  formData: FormData,
): Promise<PartnerFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = parsePartnerForm(formData);
  if (!parsed.ok) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.errors,
    };
  }

  try {
    const partner = await prisma.$transaction(async (tx) => {
      const created = await tx.partner.create({
        data: parsed.data,
        select: { id: true, name: true, email: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "PARTNER_CREATED",
          entityType: "Partner",
          entityId: created.id,
          metadata: { name: created.name, email: created.email },
        },
      });

      return created;
    });

    revalidatePartnerViews(partner.id);
    redirect(`/admin/partners/${partner.id}`);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "That email is already used by another partner.",
        errors: { email: ["Use a unique email."] },
      };
    }
    throw err;
  }
}

export async function updatePartnerAction(
  partnerId: string,
  _prev: PartnerFormState | undefined,
  formData: FormData,
): Promise<PartnerFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = parsePartnerForm(formData);
  if (!parsed.ok) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.errors,
    };
  }

  try {
    const partner = await prisma.$transaction(async (tx) => {
      const updated = await tx.partner.update({
        where: { id: partnerId },
        data: parsed.data,
        select: { id: true, name: true, email: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "PARTNER_UPDATED",
          entityType: "Partner",
          entityId: updated.id,
          metadata: { name: updated.name, email: updated.email },
        },
      });

      return updated;
    });

    revalidatePartnerViews(partner.id);
    return { ok: true, message: "Partner details saved." };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        message: "That email is already used by another partner.",
        errors: { email: ["Use a unique email."] },
      };
    }
    throw err;
  }
}

function revalidatePartnerViews(partnerId: string) {
  invalidateCacheTags(
    CACHE_TAGS.partners,
    CACHE_TAGS.adminCars,
    CACHE_TAGS.dashboard,
  );
  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${partnerId}`);
  revalidatePath(`/admin/partners/${partnerId}/edit`);
  revalidatePath("/admin/cars");
  revalidatePath("/admin/dashboard");
}
