import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  MapPin,
  User,
  Car,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  Receipt,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import BookingStatusActions from "@/components/admin/BookingStatusActions";
import BookingAdminNotesForm from "@/components/admin/BookingAdminNotesForm";
import BookingPaymentForm from "@/components/admin/BookingPaymentForm";
import { getBookingById } from "@/lib/queries/bookings";
import { getPartnerById } from "@/lib/queries/partners";
import { getPaymentsForBooking } from "@/lib/queries/payments";

const peso = (n: number) => `₱${n.toLocaleString()}`;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const [partner, payments] = await Promise.all([
    booking.partnerId ? getPartnerById(booking.partnerId) : null,
    getPaymentsForBooking(booking.id),
  ]);

  const balance = booking.totalAmount - booking.paidAmount;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Bookings", href: "/admin/bookings" },
          { label: booking.reference },
        ]}
        title={booking.reference}
        subtitle={`Submitted ${format(
          parseISO(booking.createdAt),
          "MMM d, yyyy 'at' h:mm a",
        )}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* MAIN COLUMN */}
        <div className="space-y-5">
          {/* Customer */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05] flex items-center gap-2">
              <User className="h-4 w-4 text-brand-red" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Customer Information
              </h2>
            </header>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 py-4 text-sm">
              <Field label="Full Name" value={booking.customerName} />
              <Field label="Email" value={booking.customerEmail} />
              <Field label="Contact Number" value={booking.customerContact} />
              <Field
                label="Customer Profile"
                value={
                  <Link
                    href={`/admin/customers/${booking.customerId}`}
                    className="text-brand-red hover:text-deep-red font-semibold"
                  >
                    Open profile →
                  </Link>
                }
              />
            </dl>
          </section>

          {/* Rental */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-red" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Rental Details
              </h2>
            </header>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 py-4 text-sm">
              <Field
                label="Start"
                value={format(
                  parseISO(booking.startDateTime),
                  "MMM d, yyyy · h:mm a",
                )}
              />
              <Field
                label="End"
                value={format(
                  parseISO(booking.endDateTime),
                  "MMM d, yyyy · h:mm a",
                )}
              />
              <Field label="Duration" value={`${booking.durationDays} day(s)`} />
              <Field
                label="With Driver"
                value={booking.withDriver ? "Yes" : "No (self-drive)"}
              />
              <Field label="Purpose" value={booking.purpose} />
              <Field label="Destination" value={booking.destination} />
              <Field label="Passengers" value={String(booking.passengers)} />
              {booking.notes && <Field label="Customer Notes" value={booking.notes} full />}
            </dl>
          </section>

          {/* Pickup */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-red" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Pickup &amp; Drop-off
              </h2>
            </header>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 py-4 text-sm">
              <Field label="Pickup Address" value={booking.pickupAddress} />
              <Field label="Drop-off Address" value={booking.dropoffAddress} />
            </dl>
          </section>

          {/* Documents */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05] flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-red" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex-1">
                Uploaded Documents
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Lock className="h-3 w-3" /> Admin only
              </span>
            </header>
            <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {booking.documents.map((d) => (
                <li
                  key={d.label}
                  className="px-5 py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {d.label}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                      {d.filename} · {d.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 bg-yellow-50 dark:bg-yellow-500/[.06] border-t border-yellow-200 dark:border-yellow-500/20 text-[11px] text-yellow-800 dark:text-yellow-300">
              Mock files — Cloudinary upload + admin-gated streaming endpoint land in a later
              prompt. The Open button is a placeholder.
            </div>
          </section>

          {/* Payments */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-brand-red" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  Payments
                </h2>
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {peso(booking.paidAmount)} / {peso(booking.totalAmount)}
              </span>
            </header>
            {payments.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                No payments recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
                {payments.map((p) => (
                  <li
                    key={p.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {peso(p.amount)} via {p.method}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                        {p.reference} ·{" "}
                        {format(parseISO(p.receivedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    {p.notes && (
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 italic max-w-[40%] text-right">
                        {p.notes}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Admin notes */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Internal Admin Notes
              </h2>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Private notes for verification, partner confirmation, and payment follow-up.
              </p>
            </header>
            <div className="px-5 py-4">
              <BookingAdminNotesForm
                bookingId={booking.id}
                initialNotes={booking.adminNotes}
              />
            </div>
          </section>
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className="space-y-5">
          {/* Actions */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Verification Actions
            </h2>
            <BookingStatusActions
              bookingId={booking.id}
              status={booking.status}
            />
          </section>

          {/* Pricing summary */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border-2 border-brand-red/20 dark:border-brand-red/15 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Amount
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Total</dt>
                <dd className="font-bold text-gray-900 dark:text-white">
                  {peso(booking.totalAmount)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Paid</dt>
                <dd className="font-semibold text-green-600 dark:text-green-400">
                  {peso(booking.paidAmount)}
                </dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-white/[.05]">
                <dt className="font-bold text-gray-900 dark:text-white">Balance</dt>
                <dd className="font-black text-brand-red text-base">{peso(balance)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Record Payment
            </h2>
            <BookingPaymentForm bookingId={booking.id} balance={balance} />
          </section>

          {/* Car + partner */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Car className="h-4 w-4 text-brand-red" />
              Assigned Car
            </h2>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {booking.carLabel}
            </p>
            <Link
              href={`/admin/cars/${booking.carId}`}
              className="text-xs text-brand-red hover:text-deep-red font-bold"
            >
              View car details →
            </Link>

            {partner && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[.05]">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                  Partner Owner
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {partner.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {partner.contactNumber}
                </p>
                <Link
                  href={`/admin/partners/${partner.id}`}
                  className="text-xs text-brand-red hover:text-deep-red font-bold"
                >
                  View partner →
                </Link>
              </div>
            )}
          </section>

          {/* Comms */}
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Send Communication
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                SMS
              </button>
            </div>
            <p className="mt-3 text-[10px] text-gray-400 leading-relaxed">
              Wired in Prompt 12 (Resend + Semaphore PH).
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}

function Field({ label, value, full }: FieldProps) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-white">{value}</dd>
    </div>
  );
}
