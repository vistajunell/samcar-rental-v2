"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type CustomerVerificationStatus } from "@prisma/client";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

export type CustomerReviewFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const reviewSchema = z.object({
  verificationStatus: z.enum([
    "UNVERIFIED",
    "PENDING_REVIEW",
    "VERIFIED",
    "BLACKLISTED",
  ]),
  notes: z.string().trim().max(2000, "Notes must be under 2,000 characters").optional(),
});

export async function updateCustomerReviewAction(
  customerId: string,
  _prev: CustomerReviewFormState | undefined,
  formData: FormData,
): Promise<CustomerReviewFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = reviewSchema.safeParse({
    verificationStatus: formData.get("verificationStatus") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
        select: { id: true, email: true, verificationStatus: true },
      });
      if (!customer) throw new Error("NOT_FOUND");

      await tx.customer.update({
        where: { id: customerId },
        data: {
          verificationStatus:
            parsed.data.verificationStatus as CustomerVerificationStatus,
          notes: parsed.data.notes || null,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorEmail: session.email,
          action: "CUSTOMER_REVIEW_UPDATED",
          entityType: "Customer",
          entityId: customer.id,
          metadata: {
            email: customer.email,
            from: customer.verificationStatus,
            to: parsed.data.verificationStatus,
            hasNotes: Boolean(parsed.data.notes),
          } as Prisma.InputJsonValue,
        },
      });
    });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return { ok: false, message: "Customer not found." };
    }
    throw err;
  }

  revalidateCustomerViews(customerId);
  return { ok: true, message: "Customer review saved." };
}

function revalidateCustomerViews(customerId: string) {
  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
}
