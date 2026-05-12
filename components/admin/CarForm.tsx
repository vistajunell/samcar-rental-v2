"use client";

import { useActionState, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Save } from "lucide-react";
import {
  createCarAction,
  updateCarAction,
  type CarFormState,
} from "@/app/actions/cars";
import type { CarUIView } from "@/lib/queries/cars";
import type { Partner } from "@/lib/queries/partners";

interface Props {
  mode: "create" | "edit";
  car?: CarUIView;
  partners: Partner[];
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function CarForm({ mode, car, partners }: Props) {
  const action =
    mode === "edit" && car
      ? updateCarAction.bind(null, car.id)
      : createCarAction;
  const [state, formAction, isPending] = useActionState<
    CarFormState | undefined,
    FormData
  >(action, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <StatusMessage ok={state.ok} message={state.message} />
      )}

      <Section title="Vehicle Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug" name="slug" error={errors.slug?.[0]}>
            <input
              id="slug"
              name="slug"
              type="text"
              className={inputClass}
              defaultValue={car?.slug}
              placeholder="toyota-vios-xle-2026"
            />
          </Field>
          <Field label="Brand" name="brand" error={errors.brand?.[0]}>
            <input id="brand" name="brand" type="text" className={inputClass} defaultValue={car?.brand} />
          </Field>
          <Field label="Model / Name" name="name" error={errors.name?.[0]}>
            <input id="name" name="name" type="text" className={inputClass} defaultValue={car?.name} />
          </Field>
          <Field label="Year" name="year" error={errors.year?.[0]}>
            <input id="year" name="year" type="number" className={inputClass} defaultValue={car?.year} />
          </Field>
          <Field label="Category" name="category" error={errors.category?.[0]}>
            <input
              id="category"
              name="category"
              type="text"
              className={inputClass}
              defaultValue={car?.category}
              placeholder="Sedan, MPV, SUV, Van"
            />
          </Field>
          <Field label="Tagline" name="tagline" error={errors.tagline?.[0]}>
            <input id="tagline" name="tagline" type="text" className={inputClass} defaultValue={car?.tagline} />
          </Field>
        </div>
      </Section>

      <Section title="Specs and Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Seats" name="seats" error={errors.seats?.[0]}>
            <input id="seats" name="seats" type="number" min="1" className={inputClass} defaultValue={car?.seats ?? 5} />
          </Field>
          <Field label="Price per day" name="pricePerDay" error={errors.pricePerDay?.[0]}>
            <input
              id="pricePerDay"
              name="pricePerDay"
              type="number"
              min="1"
              step="0.01"
              className={inputClass}
              defaultValue={car?.pricePerDay}
            />
          </Field>
          <Field label="Transmission" name="transmission" error={errors.transmission?.[0]}>
            <select
              id="transmission"
              name="transmission"
              className={inputClass}
              defaultValue={car?.transmission === "Manual" ? "MANUAL" : "AUTOMATIC"}
            >
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </Field>
          <Field label="Fuel Type" name="fuelType" error={errors.fuelType?.[0]}>
            <select id="fuelType" name="fuelType" className={inputClass} defaultValue={fuelValue(car?.fuelType)}>
              <option value="GASOLINE">Gasoline</option>
              <option value="DIESEL">Diesel</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ELECTRIC">Electric</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Partner and Public Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Partner Owner" name="partnerId" error={errors.partnerId?.[0]}>
            <select id="partnerId" name="partnerId" className={inputClass} defaultValue={carPartnerId(car, partners)}>
              <option value="">No partner assigned</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status" name="status" error={errors.status?.[0]}>
            <select id="status" name="status" className={inputClass} defaultValue={car?.statusRaw ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="CONFIRMED_AVAILABLE">Confirmed Available</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </Field>
          <Field label="Public Visibility" name="isPublic" error={errors.isPublic?.[0]}>
            <select id="isPublic" name="isPublic" className={inputClass} defaultValue={car?.isPublic ? "true" : "false"}>
              <option value="false">Hidden from public</option>
              <option value="true">Visible publicly</option>
            </select>
          </Field>
          <Field label="Primary Image" name="primaryImage" error={errors.primaryImage?.[0]}>
            <ImagePicker initialValue={car?.image ?? ""} />
          </Field>
        </div>
      </Section>

      <Section title="Partner-Confirmed Availability">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Available From" name="availableFrom" error={errors.availableFrom?.[0]}>
            <input id="availableFrom" name="availableFrom" type="date" className={inputClass} defaultValue={car?.availableFrom} />
          </Field>
          <Field label="Available To" name="availableTo" error={errors.availableTo?.[0]}>
            <input id="availableTo" name="availableTo" type="date" className={inputClass} defaultValue={car?.availableTo} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Availability Notes" name="availabilityNotes" error={errors.availabilityNotes?.[0]}>
              <textarea
                id="availabilityNotes"
                name="availabilityNotes"
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Partner confirmation details, restrictions, or handover notes"
              />
            </Field>
          </div>
        </div>
      </Section>

      <button
        type="submit"
        disabled={isPending}
        className="shine-btn inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-md shadow-brand-red/20"
      >
        <Save className="relative z-[2] h-4 w-4" />
        <span className="relative z-[2]">
          {isPending ? "Saving..." : mode === "create" ? "Create car" : "Save car"}
        </span>
      </button>
    </form>
  );
}

function fuelValue(fuel?: string) {
  switch (fuel) {
    case "Diesel":
      return "DIESEL";
    case "Hybrid":
      return "HYBRID";
    case "Electric":
      return "ELECTRIC";
    case "Other":
      return "OTHER";
    default:
      return "GASOLINE";
  }
}

function carPartnerId(car: CarUIView | undefined, partners: Partner[]) {
  if (!car) return "";
  return partners.find((p) => p.carIds.includes(car.id))?.id ?? "";
}

function ImagePicker({ initialValue }: { initialValue: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageValue, setImageValue] = useState(initialValue);
  const [fileName, setFileName] = useState("");
  const [localError, setLocalError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLocalError("");

    if (!file.type.startsWith("image/")) {
      setLocalError("Choose an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setLocalError("Choose an image under 8 MB.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      if (compressed.length > 1_000_000) {
        setLocalError("This image is still too large. Try a smaller photo.");
        return;
      }
      setImageValue(compressed);
      setFileName(file.name);
    } catch {
      setLocalError("Could not read that image. Try another file.");
    }
  }

  return (
    <div className="space-y-3">
      <input id="primaryImage" name="primaryImage" type="hidden" value={imageValue} readOnly />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/[.03] p-3">
        {imageValue ? (
          <div className="relative h-36 overflow-hidden rounded-lg bg-white dark:bg-black/30">
            <img
              src={imageValue}
              alt="Selected car preview"
              className="h-full w-full object-contain p-2"
            />
          </div>
        ) : (
          <div className="flex h-36 items-center justify-center rounded-lg bg-white dark:bg-black/30 text-xs font-bold text-gray-400">
            No image selected
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              {fileName || (imageValue ? "Existing image selected" : "Add a car image")}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              JPG, PNG, or WEBP. Large photos are compressed before saving.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-red/20 transition-colors hover:bg-deep-red"
          >
            <ImagePlus className="h-4 w-4" />
            Browse image
          </button>
        </div>
      </div>

      {localError && (
        <p className="flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{localError}</span>
        </p>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const maxSize = 1400;
  const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return dataUrl;

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/webp", 0.82);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] p-5">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function StatusMessage({ ok, message }: { ok: boolean; message: string }) {
  return (
    <div
      className={`rounded-xl border p-3 flex items-start gap-2 ${
        ok
          ? "border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10"
          : "border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      )}
      <p
        className={`text-xs font-semibold ${
          ok
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
