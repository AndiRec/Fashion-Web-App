import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useDeleteProduct, useProducts } from "@/hooks/useProducts";
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
import { EditIcon, PackageIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/icons";
import { categoryLabel, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const { data, isLoading, isFetching } = useProducts({
    page,
    per_page: 15,
    sort: "newest",
    search: debouncedSearch || undefined,
  });
  const deleteProduct = useDeleteProduct();
  const push = useToastStore((s) => s.push);

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
      <div className="mb-6 flex max-w-sm items-center gap-2 border border-line bg-cream-soft px-3">
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

      <div className="overflow-x-auto border border-line bg-cream">
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
          <tbody className="divide-y divide-line">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title="No products found" description="Try a different search, or add your first product." />
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

      {data && data.meta.last_page > 1 ? (
        <div className={isFetching ? "opacity-60" : ""}>
          <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
        </div>
      ) : null}

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
