import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useDeleteProduct, useProducts, type ProductFilters } from "@/hooks/useProducts";
import { useMeta } from "@/hooks/useMeta";
import { useDebounce } from "@/hooks/useDebounce";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Field";
import { EditIcon, PackageIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/icons";
import { categoryLabel, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const stockOptions: { value: NonNullable<ProductFilters["stock_status"]> | ""; label: string }[] = [
  { value: "", label: "All Stock Levels" },
  { value: "out", label: "Sold Out" },
  { value: "low", label: "Low Stock (≤10)" },
  { value: "in_stock", label: "In Stock" },
];

const sortOptions: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "stock_asc", label: "Stock: Low to High" },
  { value: "stock_desc", label: "Stock: High to Low" },
];

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState<NonNullable<ProductFilters["stock_status"]> | "">("");
  const [sort, setSort] = useState<NonNullable<ProductFilters["sort"]>>("newest");
  const debouncedSearch = useDebounce(search);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const { data: meta } = useMeta();
  const { data, isLoading, isFetching } = useProducts({
    page,
    per_page: 15,
    sort,
    search: debouncedSearch || undefined,
    category: category || undefined,
    stock_status: stockStatus || undefined,
  });
  const deleteProduct = useDeleteProduct();
  const push = useToastStore((s) => s.push);

  const hasActiveFilters = !!(search || category || stockStatus);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setStockStatus("");
    setPage(1);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteProduct.mutate(pendingDelete.id, {
      onSuccess: () => {
        push("Product deleted.");
        setPendingDelete(null);
      },
      onError: (err) => {
        push(getErrorMessage(err), "error");
        setPendingDelete(null);
      },
    });
  }

  return (
    <AdminLayout
      title="Products"
      actions={
        <Link to="/admin/products/new">
          <Button size="sm">
            <PlusIcon width={15} height={15} />
            Add Product
          </Button>
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 border border-line bg-cream-soft px-3">
          <SearchIcon width={16} height={16} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products…"
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
          />
        </div>

        <Select
          id="category-filter"
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          className="w-auto"
        >
          <option value="">All Categories</option>
          {meta?.categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </Select>

        <Select
          id="stock-filter"
          value={stockStatus}
          onChange={(v) => {
            setStockStatus(v as NonNullable<ProductFilters["stock_status"]> | "");
            setPage(1);
          }}
          className="w-auto"
        >
          {stockOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          id="sort-filter"
          value={sort}
          onChange={(v) => setSort(v as NonNullable<ProductFilters["sort"]>)}
          className="w-auto"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {hasActiveFilters ? (
          <button onClick={resetFilters} className="link-underline text-xs uppercase tracking-wider text-ink-soft">
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* Mobile: card list with full-width edit/delete buttons instead of a cramped scrolling table */}
      <div className="space-y-3 sm:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse border border-line bg-cream" />
          ))
        ) : data?.data.length === 0 ? (
          <div className="border border-line bg-cream">
            <EmptyState
              title="No products found"
              description={hasActiveFilters ? "Try a different search or filter." : "Add your first product."}
            />
          </div>
        ) : (
          data?.data.map((product) => {
            const stock = product.total_stock ?? 0;
            return (
              <div key={product.id} className={clsx("border border-line bg-cream p-4", isFetching && "opacity-60")}>
                <div className="flex gap-3">
                  <div className="flex h-16 w-14 flex-shrink-0 items-center justify-center bg-mist text-ink-soft/40">
                    {product.images[0] ? (
                      <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <PackageIcon width={18} height={18} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{product.name}</p>
                    <p className="text-xs text-ink-soft">
                      {categoryLabel(product.category)} · {formatPrice(product.price)}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={clsx(
                          "text-xs font-medium",
                          stock === 0 ? "text-rust" : stock <= 10 ? "text-taupe-dark" : "text-ink-soft",
                        )}
                      >
                        {stock} in stock
                      </span>
                      {product.new_collection ? (
                        <span className="bg-ink px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-cream">New</span>
                      ) : null}
                      {product.is_on_sale ? (
                        <span className="bg-rust px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-cream">Sale</span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Link to={`/admin/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <EditIcon width={14} height={14} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-rust text-rust hover:bg-rust hover:text-cream"
                    onClick={() => setPendingDelete(product)}
                  >
                    <TrashIcon width={14} height={14} />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop / tablet: full table */}
      <div className="hidden overflow-x-auto border border-line bg-cream sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-soft text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={clsx("divide-y divide-line", isFetching && "opacity-60")}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No products found"
                    description={hasActiveFilters ? "Try a different search or filter." : "Add your first product."}
                  />
                </td>
              </tr>
            ) : (
              data?.data.map((product) => {
                const stock = product.total_stock ?? 0;
                return (
                  <tr key={product.id} className="hover:bg-cream-soft/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-10 flex-shrink-0 items-center justify-center bg-mist text-ink-soft/40">
                          {product.images[0] ? (
                            <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <PackageIcon width={16} height={16} />
                          )}
                        </div>
                        <span className="text-ink">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{categoryLabel(product.category)}</td>
                    <td className="px-4 py-3 text-ink">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "font-medium",
                          stock === 0 ? "text-rust" : stock <= 10 ? "text-taupe-dark" : "text-ink",
                        )}
                      >
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.new_collection ? (
                          <span className="bg-ink px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">New</span>
                        ) : null}
                        {product.is_on_sale ? (
                          <span className="bg-rust px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">Sale</span>
                        ) : null}
                        {stock === 0 ? (
                          <span className="border border-rust px-2 py-0.5 text-[10px] uppercase tracking-wider text-rust">
                            Sold Out
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${product.id}/edit`}>
                          <IconButton label="Edit product">
                            <EditIcon width={15} height={15} />
                          </IconButton>
                        </Link>
                        <IconButton label="Delete product" variant="danger" onClick={() => setPendingDelete(product)}>
                          <TrashIcon width={15} height={15} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
        <span>{data ? `${data.meta.total} product${data.meta.total === 1 ? "" : "s"}` : ""}</span>
      </div>

      {data && data.meta.last_page > 1 ? <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} /> : null}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This will permanently remove the product, its images, and its stock records. This cannot be undone."
        confirmLabel="Delete Product"
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}
