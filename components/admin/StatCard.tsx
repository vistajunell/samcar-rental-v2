import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  Icon?: LucideIcon;
  accent?: "red" | "neutral" | "green" | "yellow";
}

const accentStyles: Record<NonNullable<Props["accent"]>, string> = {
  red: "bg-brand-red/[0.08] dark:bg-brand-red/10 border-brand-red/20 text-brand-red",
  neutral:
    "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300",
  green:
    "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300",
  yellow:
    "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300",
};

export default function StatCard({
  label,
  value,
  hint,
  Icon,
  accent = "red",
}: Props) {
  const iconCls = accentStyles[accent];
  return (
    <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5 hover:border-brand-red/20 dark:hover:border-brand-red/15 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center ${iconCls}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
        {value}
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
}
