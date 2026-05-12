import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Phone, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import CustomerReviewForm from "@/components/admin/CustomerReviewForm";
import { getCustomerById } from "@/lib/queries/customers";
import { getBookingsByCustomer } from "@/lib/queries/bookings";

const peso = (n: number) => `₱${n.toLocaleString()}`;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const bookings = await getBookingsByCustomer(customer.id);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
        title={customer.name}
        subtitle={`Joined ${format(parseISO(customer.joinedAt), "MMMM yyyy")}`}
        actions={<StatusBadge status={customer.verificationStatus} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  <Mail className="h-3 w-3 text-brand-red" /> Email
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">{customer.email}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  <Phone className="h-3 w-3 text-brand-red" /> Contact
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {customer.contactNumber}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  <MapPin className="h-3 w-3 text-brand-red" /> Address
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {customer.address}
                </dd>
              </div>
              {customer.facebookName && (
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Facebook Name
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {customer.facebookName}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Booking History ({bookings.length})
              </h2>
            </header>
            {bookings.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                No bookings yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-mono text-[11px] font-bold text-gray-900 dark:text-white hover:text-brand-red"
                      >
                        {b.reference}
                      </Link>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {b.carLabel} ·{" "}
                        {format(parseISO(b.startDateTime), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={b.status} />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {peso(b.totalAmount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-yellow-50 dark:bg-yellow-500/[.06] border border-yellow-200 dark:border-yellow-500/20 p-5">
            <h2 className="text-sm font-bold text-yellow-900 dark:text-yellow-300 mb-2">
              Admin Review Notes
            </h2>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
              {customer.notes || "No internal review notes yet."}
            </p>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Lifetime spend
            </p>
            <p className="text-3xl font-black text-brand-red">
              {peso(customer.totalSpent)}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              Across {customer.bookingsCount} booking
              {customer.bookingsCount === 1 ? "" : "s"}.
            </p>
          </section>

          <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Customer Review
            </h2>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              Use Blacklisted only for customers SamCar should not approve for future rentals.
            </p>
            <CustomerReviewForm customer={customer} />
          </section>
        </aside>
      </div>
    </div>
  );
}
