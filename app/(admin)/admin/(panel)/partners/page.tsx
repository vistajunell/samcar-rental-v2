import Link from "next/link";
import { Plus, ChevronRight, Phone, Mail } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { getPartners } from "@/lib/queries/partners";

export default async function PartnersListPage() {
  const partners = await getPartners();

  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle={`${partners.length} partner car owners with confirmed inventory.`}
        actions={
          <Link
            href="/admin/partners/new"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Add Partner</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((p) => (
          <Link
            key={p.id}
            href={`/admin/partners/${p.id}`}
            className="group rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5 hover:border-brand-red/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {p.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {p.address}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-red transition-colors" />
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-gray-600 dark:text-gray-300 mb-3">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-brand-red" /> {p.contactNumber}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3 text-brand-red" /> {p.email}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-white/[.05] flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {p.carIds.length} car{p.carIds.length === 1 ? "" : "s"}
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {p.commissionPct}% commission
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
