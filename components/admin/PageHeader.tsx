import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: Props) {
  return (
    <header className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            {breadcrumbs.map((c, i) => {
              const last = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="inline-flex items-center gap-1">
                  {c.href && !last ? (
                    <Link href={c.href} className="hover:text-brand-red transition-colors">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={last ? "text-gray-700 dark:text-gray-200" : ""}>
                      {c.label}
                    </span>
                  )}
                  {!last && <ChevronRight className="h-3 w-3 opacity-60" />}
                </span>
              );
            })}
          </nav>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
