import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import CarShowcaseCard from "@/components/ui/CarShowcaseCard";
import type { CarUIView } from "@/lib/queries/cars";

const stats = [
  { value: "10+", label: "Cars Available" },
  { value: "500+", label: "Happy Clients" },
  { value: "5★", label: "Rated Service" },
];

export default function HeroSection({ cars }: { cars: CarUIView[] }) {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* ── Atmospheric background (no image — pure dark with glow accents) ── */}
      <div aria-hidden className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]" />
        {/* Center radial glow under the car */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[700px] h-[400px] sm:h-[450px] rounded-full bg-brand-red/[0.18] blur-[120px]" />
        {/* Corner ambient glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-red/[0.08] blur-3xl" />
        <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] rounded-full bg-brand-red/[0.06] blur-3xl" />
        {/* Subtle grid noise via radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-32 lg:pt-32 lg:pb-44 flex flex-col items-center min-h-[100svh] lg:min-h-[820px]">
        {/* Tag pill */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-red/40 bg-brand-red/10 backdrop-blur-sm text-brand-red text-[11px] font-bold tracking-wider uppercase mb-6">
          <Star className="h-3 w-3 fill-brand-red" />
          Trusted Car Rental in Lucena, Philippines
        </span>

        {/* Title */}
        <h1 className="text-center text-white text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black leading-[1.05] tracking-tight max-w-4xl">
          Rent Your <span className="text-brand-red">Ideal Car</span>
          <br className="hidden sm:block" /> with SamCar Rental
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-center text-base lg:text-lg text-gray-400 leading-relaxed max-w-2xl">
          Browse confirmed available cars from SamCar&rsquo;s trusted partner owners. Submit your
          booking request and our team will verify availability, documents, and payment details.
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cars"
            className="shine-btn group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-red hover:bg-deep-red text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/30"
          >
            <span className="relative z-[2]">Browse Cars</span>
            <ChevronRight className="relative z-[2] h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/book"
            className="shine-btn group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 bg-white/5 backdrop-blur-md text-white hover:border-brand-red hover:text-brand-red font-bold text-sm transition-all"
          >
            <span className="relative z-[2]">Book Now</span>
          </Link>
        </div>

        {/* Car showcase carousel */}
        <div className="relative mt-8 lg:mt-10 w-full max-w-5xl">
          <CarShowcaseCard cars={cars} />
        </div>

        {/* Stats */}
        <div className="mt-10 flex gap-10 sm:gap-14 justify-center">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.value}</div>
              <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 uppercase tracking-[0.2em] font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
