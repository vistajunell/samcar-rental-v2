import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Booking", href: "/book" },
];
const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-white border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ── Brand ── */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-14 w-[150px]">
                <Image
                  src="/images/logo/samcar-logo.webp"
                  alt="SamCar Rental Lucena PH"
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Premium and reliable car rental service in Lucena City, Quezon Province, Philippines.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red flex items-center justify-center transition-colors"
              >
                <IconFacebook />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red flex items-center justify-center transition-colors"
              >
                <IconInstagram />
              </a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-red mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Lucena City, Quezon Province, Philippines
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-red shrink-0" />
                <span className="text-sm text-gray-400">+63 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-red shrink-0" />
                <span className="text-sm text-gray-400">samcar.rental@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Centered copyright ── */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500">
            © 2026 SamCar Rental Lucena PH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
