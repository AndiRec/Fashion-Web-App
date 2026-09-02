import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, type ProductFilters as Filters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Field";

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

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<Filters>(() => filtersFromParams(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, isFetching } = useProducts(filters);

  function updateFilters(next: Filters) {
    setFiltersState(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value === true ? 1 : value));
    });
    setSearchParams(params);
  }

  return (
    <div className="container-boutique py-12">
      <div className="mb-10 flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-2">Shop</p>
          <h1 className="text-3xl">All Products</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs uppercase tracking-wider text-ink-soft lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
            Filters
          </button>
          <Select
            id="sort"
            value={filters.sort ?? "newest"}
            onChange={(e) => updateFilters({ ...filters, sort: e.target.value as Filters["sort"], page: 1 })}
            className="w-auto"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters filters={filters} onChange={updateFilters} />
        </aside>

        <div>
          {isLoading ? (
            <Spinner />
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
              <button onClick={() => setMobileFiltersOpen(false)} className="text-xs uppercase text-ink-soft">
                Close
              </button>
            </div>
            <ProductFilters filters={filters} onChange={updateFilters} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
