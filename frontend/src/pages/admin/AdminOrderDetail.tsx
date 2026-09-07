import { Link, useParams } from "react-router-dom";
import { useOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Select } from "@/components/ui/Field";
import { BackButton } from "@/components/ui/BackButton";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["pending", "shipped", "delivered", "canceled"];

export function AdminOrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const push = useToastStore((s) => s.push);

  return (
    <AdminLayout title={order ? `Order #${order.id}` : "Order"}>
      {isLoading || !order ? (
        <Spinner />
      ) : (
        <div className="max-w-4xl">
          <BackButton fallback="/admin/orders" label="Back to Orders" className="mb-6" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="border border-line bg-cream">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="font-display text-lg">Items</h2>
                </div>
                <ul className="divide-y divide-line">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex gap-4 px-5 py-4">
                      <div className="h-20 w-16 flex-shrink-0 bg-mist">
                        {item.product.images[0] ? (
                          <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <Link to={`/admin/products/${item.product.id}/edit`} className="text-sm text-ink hover:underline">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-ink-soft">
                            Size {item.size} · Qty {item.quantity} · {formatPrice(item.unit_price)} each
                          </p>
                        </div>
                        <span className="text-sm text-ink">{formatPrice(item.unit_price * item.quantity)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-line px-5 py-4">
                  <span className="text-sm text-ink-soft">Total</span>
                  <span className="text-lg text-ink">{formatPrice(order.total_price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-line bg-cream p-5">
                <p className="eyebrow mb-2">Status</p>
                <Select
                  id="order-status"
                  value={order.status}
                  onChange={(e) =>
                    updateStatus.mutate(
                      { id: order.id, status: e.target.value as OrderStatus },
                      {
                        onSuccess: () => push("Order status updated."),
                        onError: (err) => push(getErrorMessage(err), "error"),
                      },
                    )
                  }
                  className="capitalize"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
                <p className="mt-3 text-xs text-ink-soft">Placed {formatDate(order.created_at)}</p>
              </div>

              <div className="border border-line bg-cream p-5">
                <p className="eyebrow mb-2">Customer</p>
                <p className="text-sm text-ink">{order.customer?.name}</p>
                <p className="text-sm text-ink-soft">{order.customer?.email}</p>
                <p className="text-sm text-ink-soft">{order.customer?.phone}</p>
              </div>

              <div className="border border-line bg-cream p-5">
                <p className="eyebrow mb-2">Shipping Address</p>
                {order.address ? (
                  <p className="text-sm text-ink-soft">
                    {order.address.street_address}
                    <br />
                    {order.address.city}, {order.address.postal_code}
                    <br />
                    {order.address.country}
                  </p>
                ) : (
                  <p className="text-sm text-ink-soft">—</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
