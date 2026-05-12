import Link from "next/link";
import { Plus, ChevronRight, Eye, EyeOff } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import SmartCarImage from "@/components/ui/SmartCarImage";
import { getAdminCars } from "@/lib/queries/cars";
import { getPartnerForCar } from "@/lib/queries/partners";

export default async function AdminCarsPage() {
  const cars = await getAdminCars();
  const enriched = await Promise.all(
    cars.map(async (c) => ({ car: c, partner: await getPartnerForCar(c.id) })),
  );

  return (
    <div>
      <PageHeader
        title="Cars"
        subtitle={`${cars.length} inventory records across all partner owners.`}
        actions={
          <Link
            href="/admin/cars/new"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Add Car</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enriched.map(({ car, partner }) => (
          <article
            key={car.id}
            className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden group hover:border-brand-red/20 transition-colors"
          >
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#0a0a0a]">
              {car.image ? (
                <SmartCarImage
                  src={car.image}
                  alt={`${car.brand} ${car.name}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold text-gray-400">
                  No image
                </div>
              )}
              <div className="absolute top-3 left-3">
                <StatusBadge status={car.status} />
              </div>
              <div className="absolute top-3 right-3">
                {car.isPublic ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase tracking-wider">
                    <Eye className="h-3 w-3" /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-500/15 border border-gray-500/30 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest">
                {car.brand} · {car.year}
              </p>
              <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                {car.name}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                {car.seats} seats · {car.transmission} · {car.fuelType}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[.05] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-gray-400">Partner</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {partner?.name ?? "—"}
                  </p>
                </div>
                <Link
                  href={`/admin/cars/${car.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-brand-red hover:text-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
