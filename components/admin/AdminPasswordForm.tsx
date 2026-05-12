"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import {
  changeAdminPasswordAction,
  type PasswordChangeState,
} from "@/app/actions/admin-settings";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function AdminPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    PasswordChangeState | undefined,
    FormData
  >(changeAdminPasswordAction, undefined);

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && (
        <div
          className={`rounded-xl border p-3 flex items-start gap-2 ${
            state.ok
              ? "border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10"
              : "border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          )}
          <p
            className={`text-xs font-semibold ${
              state.ok
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {state.message}
          </p>
        </div>
      )}

      <PasswordField
        name="currentPassword"
        label="Current password"
        autoComplete="current-password"
        errors={errors.currentPassword}
      />
      <PasswordField
        name="newPassword"
        label="New password"
        autoComplete="new-password"
        errors={errors.newPassword}
        hint="At least 10 characters with uppercase, lowercase, and a number."
      />
      <PasswordField
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        errors={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
      >
        <KeyRound className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Updating password..." : "Update password"}
        </span>
      </button>
    </form>
  );
}

function PasswordField({
  name,
  label,
  autoComplete,
  errors,
  hint,
}: {
  name: string;
  label: string;
  autoComplete: string;
  errors?: string[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="password"
        autoComplete={autoComplete}
        className={inputClass}
      />
      {errors?.length ? (
        <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{errors[0]}</span>
        </p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
