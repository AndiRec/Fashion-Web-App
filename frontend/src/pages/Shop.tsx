import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, type ProductFilters as Filters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Field";
import { categoryLabel } from "@/lib/format";
import { SlidersIcon, XIcon } from "@/components/icons";

function filtersFromParams(params: URLSearchParams): Filters {
  return {
    category: params.get("category") ?? undefined,
    size: params.get("size") ?? undefined,
    min_price: params.get("min_price") ? Number(params.get("min_price")) : undefined,
    max_price: params.get("max_price") ? Number(params.get("max_price")) : undefined,
    on_sale: params.get("on_sale") === "1" ? true : undefined,
    new_collection: params.get("new_collection") === "1" ? true : undefined,
    search: params.get("search") ?? undefined,
    sort: (params.get("sort") as Filters["sort"]) ?? undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
  };
}

function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value === true ? 1 : value));
  });
  return params;
}

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<Filters>(() => filtersFromParams(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Keep local filter state in sync when the URL changes from elsewhere
  // (header search, nav links like "Sale", browser back/forward).
  const searchParamsKey = searchParams.toString();
  useEffect(() => {
    setFiltersState(filtersFromParams(searchParams));
  }, [searchParamsKey]);

  const { data, isLoading, isFetching } = useProducts(filters);

  function updateFilters(next: Filters) {
    setFiltersState(next);
    setSearchParams(filtersToParams(next));
  }

  const activeChips: { key: keyof Filters; label: string }[] = [
    ...(filters.search ? [{ key: "search" as const, label: `"${filters.search}"` }] : []),
    ...(filters.category ? [{ key: "category" as const, label: categoryLabel(filters.category) }] : []),
    ...(filters.size ? [{ key: "size" as const, label: `Size ${filters.size}` }] : []),
    ...(filters.on_sale ? [{ key: "on_sale" as const, label: "On Sale" }] : []),
    ...(filters.new_collection ? [{ key: "new_collection" as const, label: "New Collection" }] : []),
  ];

  function removeChip(key: keyof Filters) {
    updateFilters({ ...filters, [key]: undefined, page: 1 });
  }

  return (
    <div className="container-boutique py-12">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow mb-2">Shop</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl">All Products</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="press flex items-center gap-1.5 border border-line px-3 py-2 text-xs uppercase tracking-wider text-ink-soft hover:border-ink hover:text-ink lg:hidden"
            >
              <SlidersIcon width={14} height={14} />
              Filters
            </button>
            <Select
              id="sort"
              value={filters.sort ?? "newest"}
              onChange={(v) => updateFilters({ ...filters, sort: v as Filters["sort"], page: 1 })}
              className="w-auto"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </Select>
          </div>
        </div>
      </div>

      {activeChips.length > 0 ? (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeChip(chip.key)}
              className="flex items-center gap-1.5 border border-line bg-cream-soft px-3 py-1.5 text-xs text-ink-soft hover:border-ink hover:text-ink"
            >
              {chip.label}
              <XIcon width={11} height={11} />
            </button>
          ))}
          <button
            onClick={() => updateFilters({ sort: filters.sort })}
            className="link-underline text-xs uppercase tracking-wider text-ink-soft"
          >
            Clear All
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters filters={filters} onChange={updateFilters} />
        </aside>

        <div>
          {isLoading ? (
            <ProductGridSkeleton />
          ) : (
            <>
              <p className="mb-6 text-xs text-ink-soft">{data?.meta.total ?? 0} products</p>
              <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
                <ProductGrid products={data?.data ?? []} />
              </div>
              {data ? (
                <Pagination
                  currentPage={data.meta.current_page}
                  lastPage={data.meta.last_page}
                  onChange={(page) => updateFilters({ ...filters, page })}
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div className="animate-slide-in-left h-full w-80 overflow-y-auto bg-cream p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="press text-ink-soft">
                <XIcon width={18} height={18} />
              </button>
            </div>
            <ProductFilters filters={filters} onChange={updateFilters} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
