import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { getCarBySlug } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "Booking Request Received — SamCar Rental",
  description:
    "Your booking request has been received. SamCar will verify your details and reply with the next steps.",
};

interface Props {
  searchParams: Promise<{ ref?: string; name?: string; car?: string }>;
}

const nextSteps = [
  {
    Icon: ShieldCheck,
    title: "Admin Verification",
    body:
      "Our team reviews your documents and confirms unit availability with the partner car owner.",
  },
  {
    Icon: MessageSquare,
    title: "SMS / Email Reply",
    body:
      "You’ll receive a confirmation or follow-up message with payment instructions once verified.",
  },
  {
    Icon: Mail,
    title: "Invoice / Receipt",
    body:
      "After payment, SamCar issues your official invoice or receipt and finalizes the booking.",
  },
];

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { ref, name, car: carSlug } = await searchParams;
  const car = carSlug ? await getCarBySlug(carSlug) : null;

  return (
    <main className="bg-[#f7f7f7] dark:bg-[#0a0a0a]">
      <section className="pt-32 pb-20 lg:pt-36">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Hero card */}
          <div className="relative rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] shadow-2xl shadow-black/[.06] dark:shadow-black/40 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-red via-deep-red to-brand-red" />

            <div className="p-8 lg:p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-5">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-brand-red mb-1">
                Booking Request Received
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Thank you{name ? `, ${name.split(" ")[0]}` : ""}!
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                Your booking request has been recorded. Our team will verify your documents and
                confirm availability with the partner owner before approving the rental.
              </p>

              {ref && (
                <div className="mt-6 inline-flex flex-col items-center px-5 py-3 rounded-xl bg-[#f7f7f7] dark:bg-white/[.03] border border-gray-100 dark:border-white/[.05]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Reference number
                  </span>
                  <span className="mt-0.5 font-mono text-base font-bold text-gray-900 dark:text-white tracking-wide">
                    {ref}
                  </span>
                </div>
              )}

              {car && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Requested unit:{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {car.brand} {car.name} {car.year}
                  </span>
                </p>
              )}
            </div>

            {/* What happens next */}
            <div className="border-t border-gray-100 dark:border-white/[.05] bg-[#f7f7f7] dark:bg-white/[.02] p-6 lg:p-8">
              <h2 className="text-xs font-bold text-brand-red uppercase tracking-widest mb-4 text-center">
                What happens next
              </h2>
              <ol className="space-y-4">
                {nextSteps.map(({ Icon, title, body }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-brand-red/[0.08] dark:bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTAs */}
            <div className="border-t border-gray-100 dark:border-white/[.05] p-6 lg:p-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-brand-red hover:text-brand-red text-sm font-bold transition-all"
              >
                Back to Home
              </Link>
              <Link
                href="/cars"
                className="shine-btn inline-flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-all shadow-lg shadow-brand-red/30"
              >
                <span className="relative z-[2]">Browse More Cars</span>
                <ChevronRight className="relative z-[2] h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-gray-500 dark:text-gray-400">
            Questions? Reply to the SMS we&rsquo;ll send or contact us at{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              samcar.rental@gmail.com
            </span>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
