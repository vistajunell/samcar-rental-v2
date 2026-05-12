import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { createHumanCheckChallenge } from "@/lib/admin/human-check";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin Sign In — SamCar Rental",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  const humanCheck = await createHumanCheckChallenge();

  return (
    <main className="min-h-screen bg-[#f7f7f7] dark:bg-[#050505] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-red transition-colors mb-6 uppercase tracking-wider"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to public site
        </Link>

        <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] shadow-2xl shadow-black/[.06] dark:shadow-black/40 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand-red via-deep-red to-brand-red" />
          <div className="p-7">
            <Link href="/" className="inline-flex items-center mb-5">
              <div className="relative h-12 w-[140px]">
                <Image
                  src="/images/logo/samcar-logo.webp"
                  alt="SamCar Rental"
                  fill
                  priority
                  sizes="140px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Admin sign in
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
              Manage bookings, partners, cars, payments, and notifications from the SamCar
              admin console.
            </p>
            <AdminLoginForm humanCheck={humanCheck} />
          </div>
        </div>
      </div>
    </main>
  );
}
