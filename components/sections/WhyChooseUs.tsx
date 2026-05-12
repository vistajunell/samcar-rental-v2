import {
  Users,
  ShieldCheck,
  Calendar,
  Upload,
  Mail,
  MapPin,
} from "lucide-react";

const benefits = [
  {
    Icon: Users,
    title: "Trusted Partner Cars",
    description:
      "We work directly with vetted partner car owners across Lucena and nearby areas.",
  },
  {
    Icon: ShieldCheck,
    title: "Admin-Verified Bookings",
    description:
      "Every request is reviewed by our team — documents, dates, and unit availability are confirmed before approval.",
  },
  {
    Icon: Calendar,
    title: "Flexible Rental Options",
    description:
      "Daily, weekly, or custom-length rentals tailored to your travel plans.",
  },
  {
    Icon: Upload,
    title: "Easy Document Submission",
    description:
      "Upload your IDs, selfie verification, and proof of billing securely with your booking request.",
  },
  {
    Icon: Mail,
    title: "SMS and Email Updates",
    description:
      "You’ll receive booking confirmations, payment reminders, and receipts straight to your phone and inbox.",
  },
  {
    Icon: MapPin,
    title: "Local Lucena Support",
    description:
      "Based in Lucena City — our team knows the routes, the partners, and the road.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 bg-[#f7f7f7] dark:bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Why Us
          </span>
          <h2 className="mt-1.5 text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Why Choose SamCar Rental
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
            We&apos;re committed to giving you a reliable, transparent, and well-supported car
            rental experience from request to return.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ Icon, title, description }, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] hover:border-brand-red/25 dark:hover:border-brand-red/20 hover:shadow-lg hover:shadow-brand-red/[.05] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-red/[0.08] dark:bg-brand-red/10 flex items-center justify-center mb-4 group-hover:bg-brand-red transition-all duration-300">
                <Icon className="h-5 w-5 text-brand-red group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
