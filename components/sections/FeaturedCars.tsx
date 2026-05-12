import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import CarListingCard from "@/components/cars/CarListingCard";
import type { CarUIView } from "@/lib/queries/cars";

export default function FeaturedCars({ cars }: { cars: CarUIView[] }) {
  if (cars.length === 0) return null;

  return (
    <section id="cars" className="py-20 bg-[#f7f7f7] dark:bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-[0.2em]">
              Our Fleet
            </span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured Cars
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-lg text-sm">
              Choose from our wide selection of well-maintained vehicles — sedans, SUVs, MPVs, and vans.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:text-deep-red transition-colors shrink-0"
          >
            View All Cars <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <CarListingCard key={car.id} car={car} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="shine-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-red hover:bg-deep-red text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/25"
          >
            <span className="relative z-[2]">View All Cars</span>
            <ChevronRight className="relative z-[2] h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
