import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import CarListingCard from "@/components/cars/CarListingCard";
import { getPublishedCars } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "Confirmed Available Cars — SamCar Rental Lucena PH",
  description:
    "Browse vehicles that SamCar has verified from trusted partner car owners. Submit a booking request and our team will confirm availability before approval.",
};

export default async function CarsPage() {
  const cars = await getPublishedCars();

  return (
    <main className="bg-white dark:bg-[#050505]">
      {/* Page header */}
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-14 bg-[#f7f7f7] dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/[.05]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-red/40 bg-brand-red/10 text-brand-red text-[11px] font-bold tracking-wider uppercase mb-5">
            <ShieldCheck className="h-3 w-3" />
            Admin-Verified Fleet
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Confirmed Available Cars
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Browse vehicles that SamCar has verified from trusted partner car owners. Pick a unit
            and submit a booking request — our team will confirm final availability and documents
            before approval.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {cars.length === 0 ? (
            <div className="mx-auto max-w-md text-center rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-10">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                No confirmed cars yet
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                SamCar is currently confirming new units with our partner owners. Please check back
                soon, or submit a booking request and we&apos;ll match you with an available unit.
              </p>
              <Link
                href="/book"
                className="shine-btn inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors"
              >
                <span className="relative z-[2]">Submit a Booking Request</span>
                <ChevronRight className="relative z-[2] h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-bold text-gray-900 dark:text-white">{cars.length}</span>{" "}
                  confirmed {cars.length === 1 ? "car" : "cars"}.
                </p>
                <Link
                  href="/book"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:text-deep-red transition-colors"
                >
                  Submit a booking request <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cars.map((car) => (
                  <CarListingCard key={car.id} car={car} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
