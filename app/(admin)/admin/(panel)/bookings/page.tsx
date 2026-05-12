import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, Filter, Plus, ChevronRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getBookings } from "@/lib/queries/bookings";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export default async function BookingsListPage() {
  const bookings = await getBookings();

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle={`${bookings.length} total booking requests across all statuses.`}
        actions={
          <button
            type="button"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Add Booking</span>
          </button>
        }
      />

      {/* Filter chip row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by reference, customer, or car…"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left font-bold px-5 py-3">Reference</th>
                <th className="text-left font-bold px-5 py-3">Customer</th>
                <th className="text-left font-bold px-5 py-3">Car</th>
                <th className="text-left font-bold px-5 py-3">Rental Period</th>
                <th className="text-left font-bold px-5 py-3">Status</th>
                <th className="text-left font-bold px-5 py-3">Payment</th>
                <th className="text-right font-bold px-5 py-3">Amount</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="font-mono text-[11px] font-bold text-gray-900 dark:text-white">
                      {b.reference}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Submitted {format(parseISO(b.createdAt), "MMM d, yyyy")}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {b.customerName}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {b.customerContact}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                    {b.carLabel}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-gray-700 dark:text-gray-200">
                    {format(parseISO(b.startDateTime), "MMM d")} –{" "}
                    {format(parseISO(b.endDateTime), "MMM d, yyyy")}
                    <p className="text-[10px] text-gray-400">{b.durationDays} days</p>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.paymentStatus} />
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                    {peso(b.totalAmount)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
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
