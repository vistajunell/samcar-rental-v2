"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import {
  sendBookingCommunicationAction,
  type NotificationActionState,
} from "@/app/actions/notifications";

interface Props {
  bookingId: string;
}

export default function BookingCommunicationForm({ bookingId }: Props) {
  const [state, formAction, isPending] = useActionState<
    NotificationActionState | undefined,
    FormData
  >(sendBookingCommunicationAction.bind(null, bookingId), undefined);

  return (
    <form action={formAction} className="space-y-3">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}

      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        Send a manual booking update and save the provider result to the notification log.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          name="channel"
          value="EMAIL"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-gray-200"
        >
          <Mail className="h-3.5 w-3.5" />
          {isPending ? "Sending..." : "Email"}
        </button>
        <button
          type="submit"
          name="channel"
          value="SMS"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-gray-200"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {isPending ? "Sending..." : "SMS"}
        </button>
      </div>

      <p className="text-[10px] leading-relaxed text-gray-400">
        Uses Resend for email and Semaphore PH or Twilio for SMS when the matching
        `.env` credentials are configured.
      </p>
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
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
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
