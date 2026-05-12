"use client";

import { useFormStatus } from "react-dom";
import { Archive, Eye, EyeOff, Wrench } from "lucide-react";
import {
  archiveCarAction,
  markCarUnavailableAction,
  publishCarAction,
  unpublishCarAction,
} from "@/app/actions/cars";

interface Props {
  carId: string;
  isPublic: boolean;
  status: string;
}

export default function CarVisibilityActions({ carId, isPublic, status }: Props) {
  const archived = status === "ARCHIVED";

  return (
    <div className="grid grid-cols-1 gap-2">
      {isPublic ? (
        <form action={unpublishCarAction.bind(null, carId)}>
          <ActionButton disabled={archived} variant="neutral">
            <EyeOff className="h-4 w-4" />
            Unpublish
          </ActionButton>
        </form>
      ) : (
        <form action={publishCarAction.bind(null, carId)}>
          <ActionButton disabled={archived} variant="primary">
            <Eye className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Publish</span>
          </ActionButton>
        </form>
      )}

      <form action={markCarUnavailableAction.bind(null, carId)}>
        <ActionButton disabled={archived || status === "UNAVAILABLE"} variant="neutral">
          <Wrench className="h-4 w-4" />
          Mark Unavailable
        </ActionButton>
      </form>

      <form action={archiveCarAction.bind(null, carId)}>
        <ActionButton disabled={archived} variant="danger">
          <Archive className="h-4 w-4" />
          Archive
        </ActionButton>
      </form>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  variant: "primary" | "neutral" | "danger";
}) {
  const { pending } = useFormStatus();
  const variants = {
    primary: "shine-btn bg-brand-red hover:bg-deep-red text-white",
    neutral:
      "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red",
    danger:
      "border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10",
  } as const;

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {pending ? "Updating..." : children}
    </button>
  );
}
