"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  clearAdminSession,
  setAdminSession,
} from "@/lib/admin/session";

export type AdminLoginState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  values?: { email?: string };
};

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function adminLoginAction(
  _prev: AdminLoginState | undefined,
  formData: FormData,
): Promise<AdminLoginState> {
  const rawEmail = String(formData.get("email") ?? "");
  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: formData.get("password") ?? "",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors: Object.fromEntries(
        Object.entries(flat.fieldErrors).filter(([, v]) => v && v.length),
      ) as Record<string, string[]>,
      values: { email: rawEmail },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Generic message on either branch — don't leak whether the email exists.
  const invalid: AdminLoginState = {
    ok: false,
    message: "Invalid email or password.",
    values: { email: parsed.data.email },
  };

  if (!user) return invalid;
  if (user.role !== "ADMIN" && user.role !== "STAFF") return invalid;

  const passwordOk = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash,
  );
  if (!passwordOk) return invalid;

  await setAdminSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  });

  redirect("/admin/dashboard");
}

export async function adminLogoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
