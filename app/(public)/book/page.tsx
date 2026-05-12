import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import PublicBookingForm from "@/components/booking/PublicBookingForm";
import { getPublishedCars } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "Submit a Booking Request — SamCar Rental Lucena PH",
  description:
    "Send your rental dates, destination, and required documents. SamCar will verify everything with the partner owner before approving the booking.",
};

interface Props {
  searchParams: Promise<{ car?: string }>;
}

export default async function BookPage({ searchParams }: Props) {
  const { car: carSlug } = await searchParams;
  const cars = await getPublishedCars();

  return (
    <main className="bg-[#f7f7f7] dark:bg-[#0a0a0a]">
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/cars"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-red transition-colors mb-6 uppercase tracking-wider"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to confirmed cars
          </Link>

          {/* Page header */}
          <header className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-red/40 bg-brand-red/10 text-brand-red text-[11px] font-bold tracking-wider uppercase mb-4">
              <ShieldCheck className="h-3 w-3" />
              Admin-Verified Booking
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Submit a Booking Request
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Fill out the form below. SamCar will verify your documents and the unit&apos;s
              availability with the partner owner before approving the booking. Final approval is
              subject to admin verification.
            </p>
          </header>

          {cars.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-8 text-center">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                No confirmed cars available
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                SamCar is currently confirming new units with our partner owners. Please check back
                soon.
              </p>
            </div>
          ) : (
            <PublicBookingForm cars={cars} defaultCarSlug={carSlug} />
          )}
        </div>
      </section>
    </main>
  );
}
