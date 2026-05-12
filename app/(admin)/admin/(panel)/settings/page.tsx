import { Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure SamCar identity, notifications, and integration keys."
      />

      <div className="space-y-5 max-w-3xl">
        <Section
          title="Business Profile"
          description="Shown on invoices, public pages, and outgoing notifications."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Business name" defaultValue="SamCar Rental Lucena PH" />
            <Field label="Contact email" defaultValue="samcar.rental@gmail.com" />
            <Field label="Contact number" defaultValue="+63 XXX XXX XXXX" />
            <Field label="Operating hours" defaultValue="Mon–Sun · 7:00 AM – 9:00 PM" />
            <FullField label="Address" defaultValue="Lucena City, Quezon Province, Philippines" />
          </div>
        </Section>

        <Section
          title="Notifications"
          description="Default behavior for booking-status messages."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="From name (email)" defaultValue="SamCar Rental" />
            <Field label="From email" defaultValue="no-reply@samcar.example" />
            <Field label="SMS sender ID" defaultValue="SAMCAR" />
            <Field
              label="Default SMS provider"
              defaultValue="Semaphore PH"
              hint="Configurable in .env (SMS_PROVIDER)"
            />
          </div>
        </Section>

        <Section
          title="Integrations"
          description="Status of provider connections (read-only — managed via .env)."
        >
          <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
            <IntegrationRow name="Resend (email)" status="Not configured" />
            <IntegrationRow name="Semaphore PH (SMS)" status="Not configured" />
            <IntegrationRow name="Cloudinary (uploads)" status="Not configured" />
            <IntegrationRow name="Postgres (Prisma)" status="Not configured" />
          </ul>
        </Section>

        <div className="flex justify-end">
          <button
            type="button"
            className="shine-btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
          >
            <Save className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Save changes</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400">
          Settings persistence lands in a later prompt — for now, edits are not saved.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-6">
      <header className="mb-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  defaultValue,
  hint,
}: {
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type="text" className={inputClass} defaultValue={defaultValue} />
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function FullField({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="sm:col-span-2">
      <label className={labelClass}>{label}</label>
      <input type="text" className={inputClass} defaultValue={defaultValue} />
    </div>
  );
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  return (
    <li className="flex items-center justify-between py-3 text-sm">
      <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {status}
      </span>
    </li>
  );
}
