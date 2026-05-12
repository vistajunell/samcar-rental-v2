"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import {
  createPartnerAction,
  updatePartnerAction,
  type PartnerFormState,
} from "@/app/actions/partners";
import type { Partner } from "@/lib/queries/partners";

interface Props {
  mode: "create" | "edit";
  partner?: Partner;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function PartnerForm({ mode, partner }: Props) {
  const action =
    mode === "edit" && partner
      ? updatePartnerAction.bind(null, partner.id)
      : createPartnerAction;
  const [state, formAction, isPending] = useActionState<
    PartnerFormState | undefined,
    FormData
  >(action, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}

      <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Partner Identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Partner Name" name="name" error={errors.name?.[0]}>
            <input
              id="name"
              name="name"
              type="text"
              className={inputClass}
              defaultValue={partner?.name}
              placeholder="Juan Dela Cruz"
            />
          </Field>
          <Field label="Commission %" name="commissionPct" error={errors.commissionPct?.[0]}>
            <input
              id="commissionPct"
              name="commissionPct"
              type="number"
              min="0"
              max="100"
              step="0.01"
              className={inputClass}
              defaultValue={partner?.commissionPct ?? 18}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Contact Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Contact Number" name="contactNumber" error={errors.contactNumber?.[0]}>
            <input
              id="contactNumber"
              name="contactNumber"
              type="text"
              className={inputClass}
              defaultValue={partner?.contactNumber}
              placeholder="+63 917 000 0000"
            />
          </Field>
          <Field label="Email" name="email" error={errors.email?.[0]}>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              defaultValue={partner?.email}
              placeholder="partner@example.com"
            />
          </Field>
          <Field label="Facebook" name="facebook" error={errors.facebook?.[0]}>
            <input
              id="facebook"
              name="facebook"
              type="text"
              className={inputClass}
              defaultValue={partner?.facebook}
              placeholder="Facebook name or profile link"
            />
          </Field>
          <Field label="Address" name="address" error={errors.address?.[0]}>
            <input
              id="address"
              name="address"
              type="text"
              className={inputClass}
              defaultValue={partner?.address}
              placeholder="Lucena City, Quezon"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Admin Notes
        </h2>
        <Field label="Commission / Handover Notes" name="notes" error={errors.notes?.[0]}>
          <textarea
            id="notes"
            name="notes"
            rows={5}
            className={`${inputClass} resize-none`}
            defaultValue={partner?.notes}
            placeholder="Preferred payout method, commission agreement, unit handover rules, or reminders."
          />
        </Field>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
      >
        <Save className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Saving..." : mode === "create" ? "Create partner" : "Save partner"}
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
