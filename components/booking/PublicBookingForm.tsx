"use client";

import { useActionState, useId } from "react";
import {
  ChevronRight,
  ShieldCheck,
  User,
  Car,
  MapPin,
  StickyNote,
  FileUp,
  AlertCircle,
} from "lucide-react";
import {
  createPendingBookingAction,
  type BookingActionState,
} from "@/app/actions/booking";
import type { CarUIView } from "@/lib/queries/cars";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const fieldLabelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

const fileInputClass =
  "block w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-brand-red/10 file:text-brand-red file:font-bold file:cursor-pointer hover:file:bg-brand-red hover:file:text-white file:transition-colors cursor-pointer";

const sectionEyebrowClass =
  "inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-red uppercase tracking-widest mb-1";

interface Props {
  cars: CarUIView[];
  defaultCarSlug?: string;
}

interface FieldProps {
  name: string;
  label: string;
  errors?: string[];
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  full?: boolean;
}

function Field({ name, label, errors, required, children, hint, full }: FieldProps) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className={fieldLabelClass}>
        {label}
        {required && <span className="text-brand-red ml-0.5">*</span>}
      </label>
      {children}
      {hint && !errors?.length && (
        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>
      )}
      {errors?.length ? (
        <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{errors[0]}</span>
        </p>
      ) : null}
    </div>
  );
}

export default function PublicBookingForm({ cars, defaultCarSlug }: Props) {
  const [state, formAction, isPending] = useActionState<
    BookingActionState | undefined,
    FormData
  >(createPendingBookingAction, undefined);

  const v = state?.values ?? {};
  const e = state?.errors ?? {};
  const formId = useId();

  // Pre-fill car select: prefer the user's last submission, fall back to
  // ?car=<slug> from the URL, fall back to the first published car.
  const initialCarSlug =
    v.carSlug ||
    defaultCarSlug ||
    (cars[0]?.slug ?? "");

  const initialDriver = (v.withDriver as "yes" | "no" | undefined) ?? "no";
  const initialPassengers = v.passengers || "1";

  return (
    <form
      action={formAction}
      id={formId}
      noValidate
      className="space-y-6"
      encType="multipart/form-data"
    >
      {/* Top-level error banner */}
      {state && !state.ok && state.message && (
        <div className="rounded-2xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {state.message}
          </p>
        </div>
      )}

      {/* ── Section 1 · Personal information ── */}
      <section className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <span className={sectionEyebrowClass}>
          <User className="h-3 w-3" />
          Step 1 · Personal Information
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">
          Tell us who&apos;s booking
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field name="fullName" label="Full Name" required errors={e.fullName}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={inputClass}
              defaultValue={v.fullName}
              placeholder="Juan Dela Cruz"
              autoComplete="name"
            />
          </Field>
          <Field
            name="contactNumber"
            label="Contact Number"
            required
            errors={e.contactNumber}
          >
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              className={inputClass}
              defaultValue={v.contactNumber}
              placeholder="+63 9XX XXX XXXX"
              autoComplete="tel"
            />
          </Field>
          <Field name="email" label="Email" required errors={e.email}>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              defaultValue={v.email}
              placeholder="juan@example.com"
              autoComplete="email"
            />
          </Field>
          <Field
            name="facebookName"
            label="Facebook Account Name"
            errors={e.facebookName}
            hint="Optional, helps us verify your identity"
          >
            <input
              id="facebookName"
              name="facebookName"
              type="text"
              className={inputClass}
              defaultValue={v.facebookName}
              placeholder="Juan Dela Cruz"
            />
          </Field>
          <Field
            name="residentialAddress"
            label="Full Residential Address"
            required
            errors={e.residentialAddress}
            full
          >
            <input
              id="residentialAddress"
              name="residentialAddress"
              type="text"
              className={inputClass}
              defaultValue={v.residentialAddress}
              placeholder="Street, Barangay, City, Province"
              autoComplete="street-address"
            />
          </Field>
        </div>
      </section>

      {/* ── Section 2 · Rental details ── */}
      <section className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <span className={sectionEyebrowClass}>
          <Car className="h-3 w-3" />
          Step 2 · Rental Details
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">
          When and which unit
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            name="startDateTime"
            label="Start Rental Date and Time"
            required
            errors={e.startDateTime}
          >
            <input
              id="startDateTime"
              name="startDateTime"
              type="datetime-local"
              className={inputClass}
              defaultValue={v.startDateTime}
            />
          </Field>
          <Field
            name="endDateTime"
            label="End Rental Date and Time"
            required
            errors={e.endDateTime}
          >
            <input
              id="endDateTime"
              name="endDateTime"
              type="datetime-local"
              className={inputClass}
              defaultValue={v.endDateTime}
            />
          </Field>

          <Field
            name="purpose"
            label="Purpose of Rental"
            required
            errors={e.purpose}
          >
            <input
              id="purpose"
              name="purpose"
              type="text"
              className={inputClass}
              defaultValue={v.purpose}
              placeholder="Family trip, business, event..."
            />
          </Field>
          <Field
            name="destination"
            label="Destination"
            required
            errors={e.destination}
          >
            <input
              id="destination"
              name="destination"
              type="text"
              className={inputClass}
              defaultValue={v.destination}
              placeholder="Where are you headed?"
            />
          </Field>

          <Field
            name="carSlug"
            label="Type of Car"
            required
            errors={e.carSlug}
          >
            <select
              id="carSlug"
              name="carSlug"
              className={inputClass}
              defaultValue={initialCarSlug}
            >
              {cars.length === 0 && <option value="">No cars available</option>}
              {cars.map((car) => (
                <option key={car.slug} value={car.slug}>
                  {car.brand} {car.name} {car.year} · ₱
                  {car.pricePerDay.toLocaleString()}/day
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="passengers"
            label="Number of Passengers"
            required
            errors={e.passengers}
          >
            <input
              id="passengers"
              name="passengers"
              type="number"
              min={1}
              max={20}
              className={inputClass}
              defaultValue={initialPassengers}
            />
          </Field>

          <Field
            name="withDriver"
            label="Car Rental with Driver?"
            required
            errors={e.withDriver}
            full
          >
            <div className="grid grid-cols-2 gap-3">
              {(["yes", "no"] as const).map((opt) => (
                <label
                  key={opt}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 has-[:checked]:bg-brand-red has-[:checked]:border-brand-red has-[:checked]:text-white text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <input
                    type="radio"
                    name="withDriver"
                    value={opt}
                    defaultChecked={initialDriver === opt}
                    className="sr-only"
                  />
                  {opt === "yes" ? "Yes — with driver" : "No — self-drive"}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </section>

      {/* ── Section 3 · Pickup & drop-off ── */}
      <section className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <span className={sectionEyebrowClass}>
          <MapPin className="h-3 w-3" />
          Step 3 · Pickup & Drop-off
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">
          Where the car will hand over
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            name="pickupAddress"
            label="Pickup Address"
            required
            errors={e.pickupAddress}
          >
            <input
              id="pickupAddress"
              name="pickupAddress"
              type="text"
              className={inputClass}
              defaultValue={v.pickupAddress}
              placeholder="Where should we hand over the car?"
            />
          </Field>
          <Field
            name="dropoffAddress"
            label="Drop-off Address"
            required
            errors={e.dropoffAddress}
          >
            <input
              id="dropoffAddress"
              name="dropoffAddress"
              type="text"
              className={inputClass}
              defaultValue={v.dropoffAddress}
              placeholder="Where will you return the car?"
            />
          </Field>
        </div>
      </section>

      {/* ── Section 4 · Notes ── */}
      <section className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <span className={sectionEyebrowClass}>
          <StickyNote className="h-3 w-3" />
          Step 4 · Notes
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5">
          Anything special we should know?
        </h2>

        <Field name="notes" label="Notes / Special Request" errors={e.notes}>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className={`${inputClass} resize-none`}
            defaultValue={v.notes}
            placeholder="Special handling, child seat, particular pickup time window..."
          />
        </Field>
      </section>

      {/* ── Section 5 · Document uploads ── */}
      <section className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <span className={sectionEyebrowClass}>
          <FileUp className="h-3 w-3" />
          Step 5 · Document Uploads
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
          Verify your identity
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Required for admin verification. Files are reviewed only by SamCar staff and never shown
          publicly. Accepts JPG, PNG, HEIC, or PDF up to 8 MB each.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            name="governmentId1"
            label="Government ID 1"
            required
            errors={e.governmentId1}
          >
            <input
              id="governmentId1"
              name="governmentId1"
              type="file"
              accept="image/*,application/pdf"
              className={fileInputClass}
            />
          </Field>
          <Field
            name="governmentId2"
            label="Government ID 2"
            required
            errors={e.governmentId2}
          >
            <input
              id="governmentId2"
              name="governmentId2"
              type="file"
              accept="image/*,application/pdf"
              className={fileInputClass}
            />
          </Field>
          <Field
            name="selfieWithId"
            label="Selfie Holding Valid ID"
            required
            errors={e.selfieWithId}
          >
            <input
              id="selfieWithId"
              name="selfieWithId"
              type="file"
              accept="image/*"
              className={fileInputClass}
            />
          </Field>
          <Field
            name="proofOfBilling"
            label="Recent Proof of Billing"
            required
            errors={e.proofOfBilling}
          >
            <input
              id="proofOfBilling"
              name="proofOfBilling"
              type="file"
              accept="image/*,application/pdf"
              className={fileInputClass}
            />
          </Field>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[.05] p-6 lg:p-7">
        <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-white/[.05]">
          <ShieldCheck className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Submitting this form creates a <strong>booking request</strong>, not a confirmed
            reservation. SamCar will verify your documents and the unit&apos;s availability with
            the partner owner before approving the booking. You&apos;ll be notified by SMS/email
            with the next steps and payment instructions.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="shine-btn group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-brand-red/30"
        >
          <span className="relative z-[2]">
            {isPending ? "Submitting…" : "Submit Booking Request"}
          </span>
          {!isPending && (
            <ChevronRight className="relative z-[2] h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    </form>
  );
}
