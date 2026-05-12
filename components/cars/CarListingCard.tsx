import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Users, Cog, Fuel, ChevronRight, Calendar, ShieldCheck } from "lucide-react";
import SmartCarImage from "@/components/ui/SmartCarImage";
import type { CarUIView } from "@/lib/queries/cars";

const statusStyle: Record<string, string> = {
  Published:
    "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30",
  "Confirmed Available":
    "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30",
  Reserved:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/40",
  Unavailable:
    "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/40",
  Draft:
    "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/40",
  Archived:
    "bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/40",
};

function formatAvailabilityWindow(fromIso: string, toIso: string): string {
  const fromDate = parseISO(fromIso);
  const toDate = parseISO(toIso);
  const sameYear = fromDate.getFullYear() === toDate.getFullYear();
  const fromLabel = format(fromDate, sameYear ? "MMM d" : "MMM d, yyyy");
  const toLabel = format(toDate, "MMM d, yyyy");
  return `${fromLabel} – ${toLabel}`;
}

export default function CarListingCard({ car }: { car: CarUIView }) {
  const availabilityLabel = formatAvailabilityWindow(
    car.availableFrom,
    car.availableTo,
  );

  return (
    <article className="group relative rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-brand-red/30 transition-all duration-300 overflow-hidden">
      {/* Image area */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#0a0a0a] overflow-hidden">
        <div
          aria-hidden
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-full bg-brand-red/30 blur-2xl group-hover:bg-brand-red/50 transition-colors"
        />
        <SmartCarImage
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
        />
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${statusStyle[car.status]}`}
        >
          <ShieldCheck className="h-3 w-3" />
          {car.status}
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-black/70 text-white backdrop-blur-md">
          {car.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[11px] text-brand-red font-bold uppercase tracking-widest mb-0.5">
          {car.brand} · {car.year}
        </p>
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
          {car.name}
        </h3>
        {car.tagline && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
            {car.tagline}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-brand-red" />
            {car.seats} seats
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5 text-brand-red" />
            {car.transmission}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 text-brand-red" />
            {car.fuelType}
          </span>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/[.05]">
          {/* Availability window */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-3">
            <Calendar className="h-3.5 w-3.5 text-brand-red shrink-0" />
            <span>
              Available{" "}
              <span className="text-gray-700 dark:text-gray-200 font-semibold">
                {availabilityLabel}
              </span>
            </span>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">
              Starts from
            </p>
            <p className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-red tracking-tight">
                ₱{car.pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">/ day</span>
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/cars/${car.slug}`}
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/15 bg-transparent text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red text-xs font-bold transition-all"
            >
              View Details
            </Link>
            <Link
              href={`/book?car=${car.slug}`}
              className="shine-btn inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-xs font-bold transition-all shadow-md shadow-brand-red/20"
            >
              <span className="relative z-[2]">Book Now</span>
              <ChevronRight className="relative z-[2] h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
