import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import InvoicePrintButton from "@/components/admin/InvoicePrintButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminSession } from "@/lib/admin/session";
import { getInvoiceById } from "@/lib/queries/invoices";

const peso = (n: number) => `PHP ${n.toLocaleString()}`;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoicePrintPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-4xl items-center justify-between gap-3 print:hidden">
        <Link
          href={`/admin/invoices/${invoice.id}`}
          className="text-xs font-bold text-brand-red hover:text-deep-red"
        >
          Back to invoice
        </Link>
        <div className="flex gap-2">
          <InvoicePrintButton />
          <Link
            href={`/admin/invoices/${invoice.id}/pdf`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-deep-red"
          >
            Download PDF
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl print:rounded-none print:border-0 print:shadow-none">
        <div className="h-1 w-full bg-gradient-to-r from-brand-red via-deep-red to-brand-red" />
        <div className="p-8 sm:p-10">
          <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-brand-red">
                SamCar Rental Lucena PH
              </p>
              <h1 className="text-4xl font-black tracking-tight">Invoice</h1>
              <p className="mt-1 text-sm text-gray-500">{invoice.number}</p>
            </div>
            <StatusBadge status={invoice.paymentStatus} />
          </header>

          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoBlock
              label="Bill to"
              title={invoice.customerName}
              lines={[invoice.customerEmail]}
            />
            <InfoBlock
              label="Booking"
              title={invoice.bookingReference}
              lines={[
                `Issued ${format(parseISO(invoice.issuedAt), "MMM d, yyyy")}`,
                `Due ${format(parseISO(invoice.dueDate), "MMM d, yyyy")}`,
              ]}
            />
          </div>

          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Description</th>
                  <th className="px-4 py-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-semibold">Vehicle rental - {invoice.carLabel}</p>
                    <p className="text-[11px] text-gray-500">
                      {format(parseISO(invoice.rentalStart), "MMM d, h:mm a")} to{" "}
                      {format(parseISO(invoice.rentalEnd), "MMM d, h:mm a, yyyy")}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Pickup: {invoice.pickupAddress}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Drop-off: {invoice.dropoffAddress}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right align-top font-bold">
                    {peso(invoice.subtotal)}
                  </td>
                </tr>
                {invoice.driverFee > 0 && (
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Driver fee</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {peso(invoice.driverFee)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-8 ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
            <Row label="Subtotal" value={peso(invoice.subtotal)} />
            {invoice.driverFee > 0 && (
              <Row label="Driver fee" value={peso(invoice.driverFee)} />
            )}
            <Row label="Total" value={peso(invoice.total)} bold />
            <Row label="Paid" value={peso(invoice.paid)} />
            <Row label="Balance" value={peso(invoice.balance)} bold red />
          </div>

          {invoice.notes && (
            <div className="border-t border-gray-200 pt-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Notes
              </p>
              <p className="text-xs leading-relaxed text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

function InfoBlock({
  label,
  title,
  lines,
}: {
  label: string;
  title: string;
  lines: string[];
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm font-bold">{title}</p>
      {lines.map((line) => (
        <p key={line} className="text-[11px] text-gray-500">
          {line}
        </p>
      ))}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  red,
}: {
  label: string;
  value: string;
  bold?: boolean;
  red?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "border-t border-gray-200 pt-2 text-base font-black" : ""
      }`}
    >
      <span>{label}</span>
      <span className={red ? "text-brand-red" : ""}>{value}</span>
    </div>
  );
}
