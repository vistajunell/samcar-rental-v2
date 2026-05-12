"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative h-full">
            <AdminSidebar variant="mobile" onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-[-44px] inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
