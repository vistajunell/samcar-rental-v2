import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  Users,
  Cog,
  Fuel,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getCarBySlug } from "@/lib/queries/cars";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Car not found — SamCar Rental" };
  return {
    title: `${car.brand} ${car.name} ${car.year} — SamCar Rental Lucena PH`,
    description:
      car.tagline ??
      `Confirmed available ${car.brand} ${car.name} (${car.year}) from SamCar's trusted partner owners.`,
  };
}

export default async function CarDetailPage({ params }: Params) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const fromDate = parseISO(car.availableFrom);
  const toDate = parseISO(car.availableTo);

  return (
    <main className="bg-white dark:bg-[#050505]">
      <section className="pt-32 pb-20 lg:pt-36">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/cars"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-red transition-colors mb-6 uppercase tracking-wider"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to confirmed cars
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Image card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#0a0a0a] border border-gray-100 dark:border-white/[.05] overflow-hidden h-[300px] sm:h-[400px] lg:h-[460px]">
              <div
                aria-hidden
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-brand-red/40 blur-3xl"
              />
              <Image
                src={car.image}
                alt={`${car.brand} ${car.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-contain p-6 lg:p-10 drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)]"
              />
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-black/70 text-white backdrop-blur-md">
                {car.category}
              </span>
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30">
                <ShieldCheck className="h-3 w-3" />
                {car.status}
              </span>
            </div>

            {/* Info column */}
            <div>
              <p className="text-[11px] text-brand-red font-bold uppercase tracking-[0.2em] mb-1.5">
                {car.brand} · {car.year}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {car.name}
              </h1>
              {car.tagline && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {car.tagline}
                </p>
              )}

              {/* Specs */}
              <dl className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#f7f7f7] dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-3">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <Users className="h-3 w-3 text-brand-red" /> Seats
                  </dt>
                  <dd className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                    {car.seats}
                  </dd>
                </div>
                <div className="rounded-xl bg-[#f7f7f7] dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-3">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <Cog className="h-3 w-3 text-brand-red" /> Trans.
                  </dt>
                  <dd className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                    {car.transmission}
                  </dd>
                </div>
                <div className="rounded-xl bg-[#f7f7f7] dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-3">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <Fuel className="h-3 w-3 text-brand-red" /> Fuel
                  </dt>
                  <dd className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                    {car.fuelType}
                  </dd>
                </div>
              </dl>

              {/* Availability */}
              <div className="mt-5 rounded-2xl bg-[#f7f7f7] dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  <Calendar className="h-3 w-3 text-brand-red" /> Partner-confirmed availability
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Available from</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                      {format(fromDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Available to</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-white">
                      {format(toDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing + CTA */}
              <div className="mt-5 rounded-2xl bg-white dark:bg-[#111] border-2 border-brand-red/20 dark:border-brand-red/15 p-5">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">
                  Starts from
                </p>
                <p className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-brand-red tracking-tight">
                    ₱{car.pricePerDay.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400">/ day</span>
                </p>
                <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Final pricing depends on rental length, with-driver option, and pickup location.
                  Confirmed at admin approval.
                </p>
                <Link
                  href={`/book?car=${car.slug}`}
                  className="shine-btn group mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-deep-red text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/30"
                >
                  <span className="relative z-[2]">Submit Booking Request</span>
                  <ChevronRight className="relative z-[2] h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="mt-3 text-[11px] text-center text-gray-500 dark:text-gray-400">
                  Booking requests are reviewed by SamCar before they are confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
