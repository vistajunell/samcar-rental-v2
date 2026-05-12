"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import {
  approveBookingAction,
  markBookingUnderReviewAction,
  rejectBookingAction,
} from "@/app/actions/bookings";

const TERMINAL = new Set(["REJECTED", "CANCELLED", "COMPLETED"]);

interface Props {
  bookingId: string;
  status: string;
}

export default function BookingStatusActions({ bookingId, status }: Props) {
  const isTerminal = TERMINAL.has(status);

  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <form action={approveBookingAction.bind(null, bookingId)}>
          <ActionButton
            kind="approve"
            disabled={isTerminal || status === "APPROVED"}
          >
            <CheckCircle2 className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Approve Booking</span>
          </ActionButton>
        </form>

        <form
          action={markBookingUnderReviewAction.bind(null, bookingId)}
        >
          <ActionButton
            kind="review"
            disabled={isTerminal || status === "UNDER_REVIEW"}
          >
            <Eye className="h-4 w-4" />
            Mark Under Review
          </ActionButton>
        </form>

        <form
          action={rejectBookingAction.bind(null, bookingId)}
        >
          <ActionButton kind="reject" disabled={isTerminal}>
            <XCircle className="h-4 w-4" />
            Reject Booking
          </ActionButton>
        </form>
      </div>

      {isTerminal && (
        <p className="mt-3 text-[10px] text-gray-400 leading-relaxed">
          This booking is in a terminal state and can no longer change status.
        </p>
      )}
    </>
  );
}

interface ActionButtonProps {
  kind: "approve" | "review" | "reject";
  disabled?: boolean;
  children: React.ReactNode;
}

function ActionButton({ kind, disabled, children }: ActionButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  const baseClass =
    "w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    approve:
      "shine-btn bg-brand-red hover:bg-deep-red text-white",
    review:
      "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-yellow-500 hover:text-yellow-600",
    reject:
      "border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10",
  } as const;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`${baseClass} ${variants[kind]}`}
    >
      {pending ? (
        <span className="relative z-[2]">Updating…</span>
      ) : (
        children
      )}
    </button>
  );
}
