import Link from "next/link";
import {
  CalendarCheck,
  ShieldCheck,
  CreditCard,
  Receipt,
  ChevronRight,
  Car,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getDashboardStats,
  getRecentBookings,
} from "@/lib/queries/bookings";
import { getPublishedCars } from "@/lib/queries/cars";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export default async function DashboardPage() {
  const [stats, recent, cars] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(6),
    getPublishedCars(),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of bookings, payments, and verified inventory."
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings}
          hint={`${stats.completed} completed`}
          Icon={CalendarCheck}
          accent="red"
        />
        <StatCard
          label="Pending Verification"
          value={stats.pendingVerification + stats.underReview}
          hint={`${stats.pendingVerification} new · ${stats.underReview} reviewing`}
          Icon={ShieldCheck}
          accent="yellow"
        />
        <StatCard
          label="Confirmed Cars"
          value={cars.length}
          hint="Currently published & public"
          Icon={Car}
          accent="green"
        />
        <StatCard
          label="Revenue (Paid)"
          value={peso(stats.revenue)}
          hint={`₱${stats.outstanding.toLocaleString()} outstanding`}
          Icon={CreditCard}
          accent="red"
        />
      </div>

      {/* Recent bookings */}
      <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Bookings
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Latest 6 booking requests across all statuses.
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-deep-red transition-colors"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left font-bold px-5 py-3">Reference</th>
                <th className="text-left font-bold px-5 py-3">Customer</th>
                <th className="text-left font-bold px-5 py-3">Car</th>
                <th className="text-left font-bold px-5 py-3">Status</th>
                <th className="text-left font-bold px-5 py-3">Payment</th>
                <th className="text-right font-bold px-5 py-3">Amount</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {recent.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[.02] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-[11px] font-bold text-gray-900 dark:text-white">
                    {b.reference}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                    {b.customerName}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                    {b.carLabel}
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
      </section>

      <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
        <Receipt className="h-3 w-3" />
        Mock data — no database is wired yet. Numbers come from{" "}
        <code className="font-mono">lib/queries/*</code>.
      </p>
    </div>
  );
}
