"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Handshake,
  Users,
  CreditCard,
  Receipt,
  MapPin,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { adminLogoutAction } from "@/app/actions/admin-auth";

const modules = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { href: "/admin/cars", label: "Cars", Icon: Car },
  { href: "/admin/partners", label: "Partners", Icon: Handshake },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/payments", label: "Payments", Icon: CreditCard },
  { href: "/admin/invoices", label: "Invoices", Icon: Receipt },
  { href: "/admin/gps", label: "GPS Tracking", Icon: MapPin },
  { href: "/admin/notifications", label: "Notifications", Icon: Bell },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

interface Props {
  /** When true, render compact mobile drawer styling. */
  variant?: "desktop" | "mobile";
  /** Called when a link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
}

export default function AdminSidebar({ variant = "desktop", onNavigate }: Props) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  return (
    <aside
      className={`flex flex-col bg-[#0a0a0a] border-r border-white/[.06] ${
        isMobile ? "w-72 h-full" : "w-64 h-screen sticky top-0"
      }`}
    >
      {/* Brand */}
      <div className="h-20 flex items-center gap-2 px-5 border-b border-white/[.06] shrink-0">
        <Link href="/admin/dashboard" className="flex items-center" onClick={onNavigate}>
          <div className="relative h-12 w-[130px]">
            <Image
              src="/images/logo/samcar-logo.webp"
              alt="SamCar Rental"
              fill
              priority
              sizes="130px"
              className="object-contain object-left"
            />
          </div>
        </Link>
      </div>

      {/* Modules */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          Modules
        </p>
        <ul className="space-y-0.5">
          {modules.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      active ? "text-white" : "text-gray-400 group-hover:text-brand-red"
                    }`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[.06] shrink-0">
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
