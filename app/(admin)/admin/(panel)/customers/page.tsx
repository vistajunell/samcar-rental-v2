import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getCustomers } from "@/lib/queries/customers";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export default async function CustomersListPage() {
  const customers = await getCustomers();

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customer profiles tracked.`}
      />

      <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left font-bold px-5 py-3">Name</th>
                <th className="text-left font-bold px-5 py-3">Contact</th>
                <th className="text-left font-bold px-5 py-3">Verification</th>
                <th className="text-right font-bold px-5 py-3">Bookings</th>
                <th className="text-right font-bold px-5 py-3">Total Spent</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-[12px]">
                    {c.contactNumber}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.verificationStatus} />
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                    {c.bookingsCount}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                    {peso(c.totalSpent)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-brand-red hover:text-white transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
