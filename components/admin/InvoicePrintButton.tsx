"use client";

import { Printer } from "lucide-react";

export default function InvoicePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors print:hidden"
    >
      <Printer className="h-3.5 w-3.5" /> Print
    </button>
  );
}
