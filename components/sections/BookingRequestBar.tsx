import Link from "next/link";
import { ChevronRight, ShieldCheck, Car } from "lucide-react";

export default function BookingRequestBar() {
  return (
    <section className="relative -mt-20 lg:-mt-24 z-30 px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-red via-deep-red to-brand-red" />

          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Heading */}
              <div className="flex items-start gap-4 lg:max-w-2xl">
                <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-brand-red/[0.08] dark:bg-brand-red/10 items-center justify-center border border-brand-red/20">
                  <ShieldCheck className="h-6 w-6 text-brand-red" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-red uppercase tracking-wider mb-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                    Admin-Verified Booking
                  </span>
                  <h2 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    Need a car for specific dates?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Submit your booking request and SamCar will verify available units from trusted
                    partner owners.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
                <Link
                  href="/book"
                  className="shine-btn group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-deep-red text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/30"
                >
                  <span className="relative z-[2]">Start Booking Request</span>
                  <ChevronRight className="relative z-[2] h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/cars"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-white/15 bg-transparent text-gray-800 dark:text-gray-100 hover:border-brand-red hover:text-brand-red font-bold text-sm transition-all"
                >
                  <Car className="h-4 w-4" />
                  <span>View Confirmed Cars</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
