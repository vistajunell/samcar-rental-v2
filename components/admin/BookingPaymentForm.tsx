"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import {
  recordBookingPaymentAction,
  type PaymentActionState,
} from "@/app/actions/bookings";

interface Props {
  bookingId: string;
  balance: number;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingPaymentForm({ bookingId, balance }: Props) {
  const [state, formAction, isPending] = useActionState<
    PaymentActionState | undefined,
    FormData
  >(recordBookingPaymentAction.bind(null, bookingId), undefined);

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Amount" name="amount" error={errors.amount?.[0]}>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            className={inputClass}
            defaultValue={balance > 0 ? balance.toFixed(2) : undefined}
            placeholder="0.00"
          />
        </Field>
        <Field label="Method" name="method" error={errors.method?.[0]}>
          <select id="method" name="method" className={inputClass} defaultValue="GCASH">
            <option value="GCASH">GCash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>
        </Field>
        <Field label="Reference" name="reference" error={errors.reference?.[0]}>
          <input
            id="reference"
            name="reference"
            type="text"
            className={inputClass}
            placeholder="GCash ref, OR number, bank trace..."
          />
        </Field>
        <Field label="Received At" name="receivedAt" error={errors.receivedAt?.[0]}>
          <input
            id="receivedAt"
            name="receivedAt"
            type="date"
            className={inputClass}
            defaultValue={todayValue()}
          />
        </Field>
      </div>

      <Field label="Notes" name="notes" error={errors.notes?.[0]}>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Optional internal payment note"
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
      >
        <CreditCard className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Recording..." : "Record payment"}
        </span>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function StatusMessage({ ok, message }: { ok: boolean; message: string }) {
  return (
    <div
      className={`rounded-xl border p-3 flex items-start gap-2 ${
        ok
          ? "border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10"
          : "border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      )}
      <p
        className={`text-xs font-semibold ${
          ok
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
