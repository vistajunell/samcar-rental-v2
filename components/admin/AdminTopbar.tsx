import { ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import type { AdminSession } from "@/lib/admin/session";

interface Props {
  session: AdminSession;
}

function initials(name: string): string {
  return name
    .split(/[\s.@_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export default function AdminTopbar({ session }: Props) {
  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/[.06]">
      <div className="flex items-center gap-3">
        <AdminMobileNav />
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest border border-brand-red/30">
          <ShieldCheck className="h-3 w-3" />
          Admin Console
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-red text-white text-[11px] font-bold tracking-wide">
            {initials(session.name)}
          </span>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {session.name}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {session.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
