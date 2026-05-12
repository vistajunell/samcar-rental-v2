"use client";

import { useActionState } from "react";
import { AlertCircle, Receipt } from "lucide-react";
import {
  generateInvoiceForBookingAction,
  type InvoiceActionState,
} from "@/app/actions/invoices";

interface Props {
  bookingId: string;
  disabled?: boolean;
}

export default function InvoiceGenerateForm({ bookingId, disabled }: Props) {
  const [state, formAction, isPending] = useActionState<
    InvoiceActionState | undefined,
    FormData
  >(generateInvoiceForBookingAction.bind(null, bookingId), undefined);

  return (
    <form action={formAction} className="space-y-2">
      {state?.message && (
        <p className="flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}
      <button
        type="submit"
        disabled={disabled || isPending}
        className="shine-btn inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-red px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-red/20 transition-colors hover:bg-deep-red disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Receipt className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Generating..." : "Generate Invoice"}
        </span>
      </button>
    </form>
  );
}
