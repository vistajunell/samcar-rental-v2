import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Car,
  Cog,
  Eye,
  EyeOff,
  Fuel,
  Pencil,
  Users,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import CarVisibilityActions from "@/components/admin/CarVisibilityActions";
import { getAdminCarById } from "@/lib/queries/cars";
import { getPartnerForCar } from "@/lib/queries/partners";
import { getBookingsByCar } from "@/lib/queries/bookings";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailAdminPage({ params }: Props) {
  const { id } = await params;
  const car = await getAdminCarById(id);
  if (!car) notFound();

  const [partner, bookings] = await Promise.all([
    getPartnerForCar(car.id),
    getBookingsByCar(car.id),
  ]);

  const availability =
    car.availableFrom && car.availableTo
      ? `${format(parseISO(car.availableFrom), "MMM d")} - ${format(
          parseISO(car.availableTo),
          "MMM d, yyyy",
        )}`
      : "No window";

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Cars", href: "/admin/cars" },
          { label: `${car.brand} ${car.name}` },
        ]}
        title={`${car.brand} ${car.name} ${car.year}`}
        subtitle={car.tagline}
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={car.status} />
            {car.isPublic ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-300 text-[11px] font-bold uppercase tracking-wider">
                <Eye className="h-3 w-3" /> Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-500/15 border border-gray-500/30 text-gray-700 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider">
                <EyeOff className="h-3 w-3" /> Hidden
              </span>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#0a0a0a] border border-gray-100 dark:border-white/[.05] h-[280px] sm:h-[360px]">
            {car.image ? (
              <Image
                src={car.image}
                alt={`${car.brand} ${car.name}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-contain p-6"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-gray-400">
                No image configured
              </div>
            )}
          </div>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Specifications
            </h2>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Spec Icon={Users} label="Seats" value={String(car.seats)} />
              <Spec Icon={Cog} label="Trans." value={car.transmission} />
              <Spec Icon={Fuel} label="Fuel" value={car.fuelType} />
              <Spec Icon={Calendar} label="Available" value={availability} />
            </dl>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Bookings ({bookings.length})
              </h2>
            </header>
            {bookings.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                No bookings yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-mono text-[11px] font-bold text-gray-900 dark:text-white hover:text-brand-red"
                      >
                        {b.reference}
                      </Link>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {b.customerName}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Pricing
            </h2>
            <p className="text-3xl font-black text-brand-red tracking-tight">
              ₱{car.pricePerDay.toLocaleString()}
              <span className="text-sm text-gray-400 font-normal"> / day</span>
            </p>
          </section>

          {partner && (
            <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                Partner Owner
              </h2>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {partner.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {partner.contactNumber}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {partner.email}
              </p>
              <Link
                href={`/admin/partners/${partner.id}`}
                className="mt-2 inline-block text-xs font-bold text-brand-red hover:text-deep-red"
              >
                View partner
              </Link>
            </section>
          )}

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Inventory Actions
            </h2>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <Link
                href={`/admin/cars/${car.id}/edit`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Edit details
              </Link>
            </div>
            <CarVisibilityActions
              carId={car.id}
              isPublic={car.isPublic}
              status={car.statusRaw}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}

function Spec({
  Icon,
  label,
  value,
}: {
  Icon: typeof Car;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f7f7f7] dark:bg-white/[.03] border border-gray-100 dark:border-white/[.05] p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <Icon className="h-3 w-3 text-brand-red" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
