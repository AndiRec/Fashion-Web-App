import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useMeta } from "@/hooks/useMeta";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryLabel, formatPrice } from "@/lib/format";
import type { ProductFilters as Filters } from "@/hooks/useProducts";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const PRICE_FLOOR = 0;
const PRICE_CEILING = 10000;
const PRICE_STEP = 50;

export function ProductFilters({ filters, onChange }: Props) {
  const { data: meta } = useMeta();

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  // Price is dragged on a slider and only applied (triggering a refetch)
  // once the user pauses, instead of firing a request per movement.
  const [minPrice, setMinPrice] = useState(filters.min_price ?? PRICE_FLOOR);
  const [maxPrice, setMaxPrice] = useState(filters.max_price ?? PRICE_CEILING);
  const debouncedMin = useDebounce(minPrice);
  const debouncedMax = useDebounce(maxPrice);
  const isFirstRun = useRef(true);

  useEffect(() => {
    setMinPrice(filters.min_price ?? PRICE_FLOOR);
    setMaxPrice(filters.max_price ?? PRICE_CEILING);
  }, [filters.min_price, filters.max_price]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onChange({
      ...filters,
      min_price: debouncedMin > PRICE_FLOOR ? debouncedMin : undefined,
      max_price: debouncedMax < PRICE_CEILING ? debouncedMax : undefined,
      page: 1,
    });
    // eslint-disable-next-line
  }, [debouncedMin, debouncedMax]);

  const minPercent = ((minPrice - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;
  const maxPercent = ((maxPrice - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="eyebrow mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => set("category", undefined)}
            className={clsx("text-left text-sm", !filters.category ? "text-ink font-medium" : "text-ink-soft hover:text-ink")}
          >
            All
          </button>
          {meta?.categories.map((category) => (
            <button
              key={category}
              onClick={() => set("category", category)}
              className={clsx(
                "text-left text-sm",
                filters.category === category ? "text-ink font-medium" : "text-ink-soft hover:text-ink",
              )}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="eyebrow mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {meta?.sizes.map((size) => (
            <button
              key={size}
              onClick={() => set("size", filters.size === size ? undefined : size)}
              className={clsx(
                "flex h-9 w-9 items-center justify-center border text-xs",
                filters.size === size ? "border-ink bg-ink text-cream" : "border-line text-ink-soft hover:border-ink",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="eyebrow mb-4">Price (ден.)</h3>
        <div className="relative h-4">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEILING}
            step={PRICE_STEP}
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - PRICE_STEP))}
            className="range-slider-thumb absolute inset-x-0 top-1/2 w-full -translate-y-1/2 pointer-events-none"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEILING}
            step={PRICE_STEP}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + PRICE_STEP))}
            className="range-slider-thumb absolute inset-x-0 top-1/2 w-full -translate-y-1/2 pointer-events-none"
            aria-label="Maximum price"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
          <span>{formatPrice(minPrice)}</span>
          <span>{maxPrice >= PRICE_CEILING ? `${formatPrice(PRICE_CEILING)}+` : formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.on_sale ?? false}
            onChange={(e) => set("on_sale", e.target.checked || undefined)}
            className="h-4 w-4 accent-ink"
          />
          On sale
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.new_collection ?? false}
            onChange={(e) => set("new_collection", e.target.checked || undefined)}
            className="h-4 w-4 accent-ink"
          />
          New collection
        </label>
      </div>

      <button
        onClick={() => onChange({ sort: filters.sort })}
        className="link-underline text-xs uppercase tracking-wider text-ink-soft"
      >
        Clear filters
      </button>
    </div>
  );
}
