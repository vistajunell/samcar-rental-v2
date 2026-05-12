import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Printer, Download, Mail } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getInvoiceById } from "@/lib/queries/invoices";

const peso = (n: number) => `₱${n.toLocaleString()}`;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Invoices", href: "/admin/invoices" },
          { label: invoice.number },
        ]}
        title={invoice.number}
        subtitle={`Issued ${format(parseISO(invoice.issuedAt), "MMM d, yyyy")} · Due ${format(
          parseISO(invoice.dueDate),
          "MMM d, yyyy",
        )}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/invoices/${invoice.id}/print`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </Link>
            <Link
              href={`/admin/invoices/${invoice.id}/pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Link>
            <button
              type="button"
              className="shine-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-red hover:bg-deep-red text-white text-xs font-bold transition-colors"
            >
              <Mail className="relative z-[2] h-3.5 w-3.5" />
              <span className="relative z-[2]">Email Customer</span>
            </button>
          </div>
        }
      />

      <article className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-brand-red via-deep-red to-brand-red" />
        <div className="p-7 lg:p-10">
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-white/[.05]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red mb-1">
                SamCar Rental Lucena PH
              </p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Invoice
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {invoice.number}
              </p>
            </div>
            <StatusBadge status={invoice.paymentStatus} />
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Bill to
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {invoice.customerName}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {invoice.customerEmail}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Booking
              </p>
              <Link
                href={`/admin/bookings/${invoice.bookingId}`}
                className="font-mono text-sm font-bold text-brand-red hover:text-deep-red"
              >
                {invoice.bookingReference}
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-white/[.05] overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-[#f7f7f7] dark:bg-white/[.02] text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-left font-bold px-4 py-3">Description</th>
                  <th className="text-right font-bold px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[.05]">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Vehicle rental — {invoice.carLabel}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {format(parseISO(invoice.rentalStart), "MMM d, h:mm a")} →{" "}
                      {format(parseISO(invoice.rentalEnd), "MMM d, h:mm a, yyyy")}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Pickup: {invoice.pickupAddress} · Drop-off: {invoice.dropoffAddress}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white align-top">
                    {peso(invoice.subtotal)}
                  </td>
                </tr>
                {invoice.driverFee > 0 && (
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      Driver fee
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      {peso(invoice.driverFee)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-2 mb-6">
            <Row label="Subtotal" value={peso(invoice.subtotal)} />
            {invoice.driverFee > 0 && (
              <Row label="Driver fee" value={peso(invoice.driverFee)} />
            )}
            <Row label="Total" value={peso(invoice.total)} bold />
            <Row label="Paid" value={peso(invoice.paid)} accent="green" />
            <Row label="Balance" value={peso(invoice.balance)} bold accent="red" />
          </div>

          {invoice.notes && (
            <div className="pt-6 border-t border-gray-100 dark:border-white/[.05]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Notes
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </article>

      <p className="mt-5 text-[11px] text-gray-400">
        PDF download and clean browser print output are admin-gated.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: "green" | "red";
}) {
  const valueColor =
    accent === "green"
      ? "text-green-600 dark:text-green-400"
      : accent === "red"
        ? "text-brand-red"
        : "text-gray-900 dark:text-white";
  return (
    <div className="flex items-baseline gap-6 text-sm min-w-[260px] justify-between">
      <span className={bold ? "font-bold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
        {label}
      </span>
      <span className={`${bold ? "text-base font-black" : "font-semibold"} ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}
