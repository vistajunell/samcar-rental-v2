"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, ShieldCheck, User } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export interface UserMenuProps {
  user: { id: string; email: string; name: string; role: "CUSTOMER" | "ADMIN" };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const isAdmin = user.role === "ADMIN";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 dark:border-white/15 hover:border-brand-red dark:hover:border-brand-red bg-white dark:bg-white/5 transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-red text-white text-[11px] font-bold tracking-wide">
          {initials(user.name)}
        </span>
        <span className="hidden xl:inline text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate flex-1">
                  {user.name}
                </p>
                {isAdmin && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-brand-red/10 text-brand-red border border-brand-red/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>

            <div className="py-1">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <ShieldCheck className="h-4 w-4 text-brand-red" />
                  Admin Console
                </Link>
              )}
              <Link
                href="/bookings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <User className="h-4 w-4 text-gray-400" />
                My Bookings
              </Link>
            </div>

            <div className="border-t border-gray-100 dark:border-white/10 py-1">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/5"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
