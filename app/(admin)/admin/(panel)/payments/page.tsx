import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Plus, FileText } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { getPayments } from "@/lib/queries/payments";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export default async function PaymentsListPage() {
  const payments = await getPayments();
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} recorded payments · ${peso(total)} received total.`}
        actions={
          <button
            type="button"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Record Payment</span>
          </button>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left font-bold px-5 py-3">Booking</th>
                <th className="text-left font-bold px-5 py-3">Customer</th>
                <th className="text-left font-bold px-5 py-3">Method</th>
                <th className="text-left font-bold px-5 py-3">Reference</th>
                <th className="text-left font-bold px-5 py-3">Received</th>
                <th className="text-right font-bold px-5 py-3">Amount</th>
                <th className="text-center font-bold px-5 py-3">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/bookings/${p.bookingId}`}
                      className="font-mono text-[11px] font-bold text-gray-900 dark:text-white hover:text-brand-red"
                    >
                      {p.bookingReference}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                    {p.customerName}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-xs font-bold uppercase">
                    {p.method}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 font-mono text-[11px]">
                    {p.reference}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-[12px]">
                    {format(parseISO(p.receivedAt), "MMM d, yyyy h:mm a")}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                    {peso(p.amount)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {p.proofFilename ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                        <FileText className="h-3 w-3" /> {p.proofFilename}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">—</span>
                    )}
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
