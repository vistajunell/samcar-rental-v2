"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin/session";

export type PasswordChangeState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[a-z]/, "Add at least one lowercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function changeAdminPasswordAction(
  _prev: PasswordChangeState | undefined,
  formData: FormData,
): Promise<PasswordChangeState> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, message: "Your admin session expired. Please sign in again." };
  }

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: Object.fromEntries(
        Object.entries(flat.fieldErrors).filter(([, v]) => v && v.length),
      ) as Record<string, string[]>,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user) {
    return { ok: false, message: "Admin user was not found." };
  }

  const currentOk = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!currentOk) {
    return {
      ok: false,
      message: "Current password is incorrect.",
      errors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  const nextHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: nextHash },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorEmail: session.email,
        action: "ADMIN_PASSWORD_CHANGED",
        entityType: "User",
        entityId: user.id,
        metadata: { email: user.email },
      },
    }),
  ]);

  revalidatePath("/admin/settings");
  return { ok: true, message: "Password updated successfully." };
}
