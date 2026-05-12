import { Search, FileText, ShieldCheck, BadgeCheck, ChevronRight } from "lucide-react";

const steps = [
  {
    Icon: Search,
    title: "Browse Confirmed Cars",
    description:
      "View vehicles SamCar has confirmed from trusted partner car owners.",
  },
  {
    Icon: FileText,
    title: "Submit Booking Request",
    description:
      "Send your rental dates, destination, pickup details, and required documents.",
  },
  {
    Icon: ShieldCheck,
    title: "Wait for Admin Verification",
    description:
      "Our team reviews your request, validates documents, and confirms final availability.",
  },
  {
    Icon: BadgeCheck,
    title: "Pay and Receive Confirmation",
    description:
      "Once approved, receive payment instructions, SMS/email confirmation, and invoice or receipt.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="mt-1.5 text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
            Renting a car with SamCar is quick and easy. Four simple steps from request to
            confirmation.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div
                key={i}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-brand-red/[0.08] dark:bg-brand-red/10 flex items-center justify-center border border-brand-red/20 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300">
                    <step.Icon className="h-8 w-8 text-brand-red group-hover:text-white transition-colors duration-300" />
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-red text-white text-[11px] font-black flex items-center justify-center shadow-md shadow-brand-red/30">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Connector arrow — sits in the gutter to the right of this step.
                    Only shown on lg+ where steps are in a single row. */}
                {!isLast && (
                  <ChevronRight
                    aria-hidden
                    className="hidden lg:block absolute top-10 -right-7 -translate-y-1/2 h-7 w-7 text-brand-red/60"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
