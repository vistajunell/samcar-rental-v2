import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { getPartnerById } from "@/lib/queries/partners";
import { getCarsForCarousel } from "@/lib/queries/cars";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) notFound();

  const allCars = await getCarsForCarousel();
  const cars = allCars.filter((c) => partner.carIds.includes(c.id));

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Partners", href: "/admin/partners" },
          { label: partner.name },
        ]}
        title={partner.name}
        subtitle={`Joined ${format(parseISO(partner.joinedAt), "MMMM yyyy")}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field Icon={Phone} label="Contact" value={partner.contactNumber} />
              <Field Icon={Mail} label="Email" value={partner.email} />
              <Field Icon={MapPin} label="Address" value={partner.address} />
              {partner.facebook && (
                <Field Icon={Globe} label="Facebook" value={partner.facebook} />
              )}
            </dl>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Cars under this partner ({cars.length})
              </h2>
            </header>
            {cars.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                No cars yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
                {cars.map((c) => (
                  <li
                    key={c.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div>
                      <Link
                        href={`/admin/cars/${c.id}`}
                        className="font-bold text-gray-900 dark:text-white hover:text-brand-red"
                      >
                        {c.brand} {c.name} {c.year}
                      </Link>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {c.category} · {c.transmission} · {c.fuelType}
                      </p>
                    </div>
                    <span className="font-bold text-brand-red">
                      ₱{c.pricePerDay.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {partner.notes && (
            <section className="rounded-2xl bg-yellow-50 dark:bg-yellow-500/[.06] border border-yellow-200 dark:border-yellow-500/20 p-5">
              <h2 className="text-sm font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                Notes
              </h2>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                {partner.notes}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white dark:bg-[#111] border-2 border-brand-red/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Commission rate
            </p>
            <p className="text-3xl font-black text-brand-red">{partner.commissionPct}%</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Per booking, deducted from gross.
            </p>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Actions
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                Edit partner
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                Send confirmation request
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Field({
  Icon,
  label,
  value,
}: {
  Icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
        <Icon className="h-3 w-3 text-brand-red" />
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-white">{value}</dd>
    </div>
  );
}
