import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Plus, ChevronRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getInvoices } from "@/lib/queries/invoices";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export default async function InvoicesListPage() {
  const invoices = await getInvoices();

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices issued.`}
        actions={
          <button
            type="button"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Generate Invoice</span>
          </button>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left font-bold px-5 py-3">Invoice #</th>
                <th className="text-left font-bold px-5 py-3">Customer</th>
                <th className="text-left font-bold px-5 py-3">Car</th>
                <th className="text-left font-bold px-5 py-3">Issued</th>
                <th className="text-left font-bold px-5 py-3">Status</th>
                <th className="text-right font-bold px-5 py-3">Total</th>
                <th className="text-right font-bold px-5 py-3">Balance</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {invoices.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-[11px] font-bold text-gray-900 dark:text-white">
                    {i.number}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                    {i.customerName}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-[12px]">
                    {i.carLabel}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-[12px]">
                    {format(parseISO(i.issuedAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={i.paymentStatus} />
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                    {peso(i.total)}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-brand-red">
                    {peso(i.balance)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/invoices/${i.id}`}
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
