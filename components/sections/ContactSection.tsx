import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    Icon: Phone,
    label: "Phone / Viber / WhatsApp",
    value: "+63 XXX XXX XXXX",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "samcar.rental@gmail.com",
  },
  {
    Icon: MapPin,
    label: "Address",
    value: "Lucena City, Quezon Province, Philippines",
  },
  {
    Icon: Clock,
    label: "Operating Hours",
    value: "Monday – Sunday: 7:00 AM – 9:00 PM",
  },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="mt-1.5 text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Contact Us
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
            Have questions about booking or availability? Reach out and we&apos;ll respond as soon
            as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Contact info ── */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Reach Us Directly
            </h3>
            <div className="space-y-5">
              {contactInfo.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-red/[0.08] dark:bg-brand-red/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact form ── */}
          <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
              Send Us a Message
            </h3>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input type="text" placeholder="Juan Dela Cruz" className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input type="tel" placeholder="+63 9XX XXX XXXX" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Email
                </label>
                <input type="email" placeholder="juan@example.com" className={inputClass} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your rental needs..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-brand-red hover:bg-deep-red active:scale-95 text-white font-bold text-sm transition-all shadow-lg shadow-brand-red/20"
              >
                Send Message
              </button>
              <p className="text-xs text-center text-gray-400">
                We typically respond within 1 hour during business hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
