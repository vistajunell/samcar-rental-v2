import type {
  BookingStatus,
  PaymentStatus,
} from "@/lib/queries/bookings";
import type { CustomerVerificationStatus } from "@/lib/queries/customers";
import type { CarStatus } from "@/lib/queries/cars";

type AnyStatus =
  | BookingStatus
  | PaymentStatus
  | CustomerVerificationStatus
  | CarStatus
  | string;

const styleByStatus: Record<string, string> = {
  // Booking
  PENDING_VERIFICATION:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  UNDER_REVIEW: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  APPROVED: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  REJECTED: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  CANCELLED: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  // Payment
  UNPAID: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  PARTIALLY_PAID:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  PAID: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  REFUNDED: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
  // Customer
  UNVERIFIED: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
  PENDING_REVIEW:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  VERIFIED: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  BLACKLISTED: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  // Car
  "Confirmed Available":
    "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30",
  Reserved: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  Unavailable: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30",
};

const labelByStatus: Record<string, string> = {
  PENDING_VERIFICATION: "Pending verification",
  UNDER_REVIEW: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially paid",
  PAID: "Paid",
  REFUNDED: "Refunded",
  UNVERIFIED: "Unverified",
  PENDING_REVIEW: "Pending review",
  VERIFIED: "Verified",
  BLACKLISTED: "Blacklisted",
};

export default function StatusBadge({ status }: { status: AnyStatus }) {
  const cls =
    styleByStatus[status] ??
    "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30";
  const label = labelByStatus[status] ?? status;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}
