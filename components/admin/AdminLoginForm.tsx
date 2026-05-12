"use client";

import { useActionState } from "react";
import { ChevronRight, AlertCircle, ShieldCheck } from "lucide-react";
import {
  adminLoginAction,
  type AdminLoginState,
} from "@/app/actions/admin-auth";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<
    AdminLoginState | undefined,
    FormData
  >(adminLoginAction, undefined);

  const e = state?.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state && !state.ok && state.message && (
        <div className="rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-red-700 dark:text-red-300">
            {state.message}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          defaultValue={state?.values?.email}
          placeholder="admin@samcar.example"
        />
        {e.email?.length ? (
          <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{e.email[0]}</span>
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
          placeholder="•••••••••"
        />
        {e.password?.length ? (
          <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{e.password[0]}</span>
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/30"
      >
        <span className="relative z-[2]">
          {isPending ? "Signing in…" : "Sign in to Admin Console"}
        </span>
        {!isPending && <ChevronRight className="relative z-[2] h-4 w-4" />}
      </button>

      <div className="flex items-start gap-2 pt-3 border-t border-gray-100 dark:border-white/[.05]">
        <ShieldCheck className="h-4 w-4 text-brand-red shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          Sign in with your SamCar admin credentials. Sessions are signed JWTs
          stored in an HTTP-only cookie.
        </p>
      </div>
    </form>
  );
}
