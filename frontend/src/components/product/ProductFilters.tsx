import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useMeta } from "@/hooks/useMeta";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryLabel } from "@/lib/format";
import type { ProductFilters as Filters } from "@/hooks/useProducts";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onChange }: Props) {
  const { data: meta } = useMeta();

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  // Price inputs are typed freely and only applied (triggering a refetch)
  // once the user pauses, instead of firing a request per keystroke.
  const [minPrice, setMinPrice] = useState(filters.min_price?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.max_price?.toString() ?? "");
  const debouncedMin = useDebounce(minPrice);
  const debouncedMax = useDebounce(maxPrice);
  const isFirstRun = useRef(true);

  useEffect(() => {
    setMinPrice(filters.min_price?.toString() ?? "");
    setMaxPrice(filters.max_price?.toString() ?? "");
  }, [filters.min_price, filters.max_price]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onChange({
      ...filters,
      min_price: debouncedMin ? Number(debouncedMin) : undefined,
      max_price: debouncedMax ? Number(debouncedMax) : undefined,
      page: 1,
    });
    // eslint-disable-next-line
  }, [debouncedMin, debouncedMax]);

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
        <h3 className="eyebrow mb-3">Price (ден.)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-line bg-cream-soft px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
          <span className="text-ink-soft">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-line bg-cream-soft px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
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
