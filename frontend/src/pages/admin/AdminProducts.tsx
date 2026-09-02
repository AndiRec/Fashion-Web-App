import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProduct, useProducts } from "@/hooks/useProducts";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { formatPrice } from "@/lib/format";

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, per_page: 15, sort: "newest" });
  const deleteProduct = useDeleteProduct();
  const push = useToastStore((s) => s.push);

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-end">
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="overflow-x-auto border border-line">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream-soft text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data?.data.map((product) => (
                  <tr key={product.id}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="h-12 w-10 flex-shrink-0 bg-mist">
                        {product.images[0] ? (
                          <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      {product.name}
                    </td>
                    <td className="px-4 py-3 capitalize text-ink-soft">{product.category}</td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">{product.total_stock ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.new_collection ? <span className="bg-ink px-2 py-0.5 text-[10px] text-cream">New</span> : null}
                        {product.is_on_sale ? <span className="bg-rust px-2 py-0.5 text-[10px] text-cream">Sale</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link to={`/admin/products/${product.id}/edit`} className="link-underline text-xs text-ink-soft">
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) {
                              deleteProduct.mutate(product.id, {
                                onSuccess: () => push("Product deleted."),
                                onError: (err) => push(getErrorMessage(err), "error"),
                              });
                            }
                          }}
                          className="text-xs text-ink-soft hover:text-rust"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data ? <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} /> : null}
        </>
      )}
    </AdminLayout>
  );
}
