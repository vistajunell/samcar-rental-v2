"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import {
  updateBookingAdminNotesAction,
  type AdminNotesActionState,
} from "@/app/actions/bookings";

interface Props {
  bookingId: string;
  initialNotes?: string;
}

const textareaClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none";

export default function BookingAdminNotesForm({ bookingId, initialNotes }: Props) {
  const [state, formAction, isPending] = useActionState<
    AdminNotesActionState | undefined,
    FormData
  >(updateBookingAdminNotesAction.bind(null, bookingId), undefined);

  const error = state?.errors?.adminNotes?.[0];

  return (
    <form action={formAction} className="space-y-3">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}
      <div>
        <label
          htmlFor="adminNotes"
          className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block"
        >
          Admin Notes
        </label>
        <textarea
          id="adminNotes"
          name="adminNotes"
          rows={5}
          className={textareaClass}
          defaultValue={initialNotes}
          placeholder="Internal notes for verification, partner confirmation, payment follow-up..."
        />
        {error && (
          <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
      >
        <Save className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Saving..." : "Save notes"}
        </span>
      </button>
    </form>
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
