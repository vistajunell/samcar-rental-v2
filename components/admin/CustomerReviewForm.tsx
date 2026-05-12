"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  updateCustomerReviewAction,
  type CustomerReviewFormState,
} from "@/app/actions/customers";
import type { Customer } from "@/lib/queries/customers";

interface Props {
  customer: Customer;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function CustomerReviewForm({ customer }: Props) {
  const [state, formAction, isPending] = useActionState<
    CustomerReviewFormState | undefined,
    FormData
  >(updateCustomerReviewAction.bind(null, customer.id), undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-3">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}

      <div>
        <label htmlFor="verificationStatus" className={labelClass}>
          Verification Status
        </label>
        <select
          id="verificationStatus"
          name="verificationStatus"
          className={inputClass}
          defaultValue={customer.verificationStatus}
        >
          <option value="UNVERIFIED">Unverified</option>
          <option value="PENDING_REVIEW">Pending review</option>
          <option value="VERIFIED">Verified</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>
        {errors.verificationStatus?.[0] && (
          <FieldError message={errors.verificationStatus[0]} />
        )}
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Admin Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          className={`${inputClass} resize-none`}
          defaultValue={customer.notes}
          placeholder="Verification notes, document observations, previous issues, or blacklist reason."
        />
        {errors.notes?.[0] && <FieldError message={errors.notes[0]} />}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-red px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-red/20 transition-colors hover:bg-deep-red disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShieldCheck className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Saving..." : "Save Review"}
        </span>
      </button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
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
