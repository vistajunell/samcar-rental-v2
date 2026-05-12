"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

export interface Facets {
  categories: ("Sedan" | "SUV" | "MPV" | "Van")[];
  seats: number[];
  transmissions: ("Automatic" | "Manual")[];
  priceRange: { min: number; max: number };
}

const sortOptions = [
  { value: "", label: "Brand (A–Z)" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

const labelClass =
  "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block";

const fieldClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all";

export default function CarFilters({ facets }: { facets: Facets }) {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  /* Read current filter values from URL */
  const current = useMemo(
    () => ({
      q: search.get("q") ?? "",
      category: search.get("category") ?? "",
      seats: search.get("seats") ?? "",
      transmission: search.get("transmission") ?? "",
      maxPrice: search.get("maxPrice") ?? "",
      sort: search.get("sort") ?? "",
    }),
    [search],
  );

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(search.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.replace(`/cars${params.toString() ? `?${params.toString()}` : ""}`);
      });
    },
    [router, search],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.replace("/cars");
    });
  }, [router]);

  const hasFilters = !!(
    current.q ||
    current.category ||
    current.seats ||
    current.transmission ||
    current.maxPrice ||
    current.sort
  );

  return (
    <aside className="lg:sticky lg:top-24 rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 p-5 lg:p-6 self-start">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          Filters
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-red" />}
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-brand-red hover:text-deep-red uppercase tracking-wider inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Search */}
        <div>
          <label htmlFor="filter-q" className={labelClass}>
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="filter-q"
              type="search"
              defaultValue={current.q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Brand or model…"
              className={`${fieldClass} pl-9`}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <p className={labelClass}>Category</p>
          <div className="flex flex-wrap gap-1.5">
            {facets.categories.map((cat) => {
              const active = current.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParam("category", active ? "" : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-red text-white border border-brand-red"
                      : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-brand-red"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seats */}
        <div>
          <label htmlFor="filter-seats" className={labelClass}>
            Seats
          </label>
          <select
            id="filter-seats"
            value={current.seats}
            onChange={(e) => updateParam("seats", e.target.value)}
            className={fieldClass}
          >
            <option value="">Any</option>
            {facets.seats.map((s) => (
              <option key={s} value={s}>
                {s}+ seats
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <p className={labelClass}>Transmission</p>
          <div className="flex gap-1.5">
            {facets.transmissions.map((t) => {
              const active = current.transmission === t;
              return (
                <button
                  key={t}
                  onClick={() => updateParam("transmission", active ? "" : t)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-red text-white border border-brand-red"
                      : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-brand-red"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max price */}
        <div>
          <label htmlFor="filter-price" className={labelClass}>
            Max price <span className="text-gray-400 font-normal lowercase tracking-normal">/ day</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="filter-price"
              type="range"
              min={facets.priceRange.min}
              max={facets.priceRange.max}
              step={100}
              defaultValue={current.maxPrice || facets.priceRange.max}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="flex-1 accent-brand-red"
            />
            <span className="text-xs font-bold text-brand-red tabular-nums whitespace-nowrap">
              ₱{Number(current.maxPrice || facets.priceRange.max).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="filter-sort" className={labelClass}>
            Sort by
          </label>
          <select
            id="filter-sort"
            value={current.sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className={fieldClass}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
