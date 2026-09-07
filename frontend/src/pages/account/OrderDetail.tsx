import { useParams } from "react-router-dom";
import { useCancelOrder, useOrder } from "@/hooks/useOrders";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { formatDate, formatPrice } from "@/lib/format";

export function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const push = useToastStore((s) => s.push);

  if (isLoading) return <Spinner className="py-32" />;
  if (!order) return <div className="container-boutique py-32 text-center text-ink-soft">Order not found.</div>;

  return (
    <AccountLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <BackButton fallback="/account/orders" label="Back to Orders" />
          <h2 className="mt-2 font-display text-2xl">Order #{order.id}</h2>
          <p className="text-xs text-ink-soft">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul className="mb-8 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex gap-4 py-4">
            <div className="h-20 w-16 flex-shrink-0 bg-mist">
              {item.product.images[0] ? (
                <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm text-ink">{item.product.name}</p>
                <p className="text-xs text-ink-soft">
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm text-ink">{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h3 className="eyebrow mb-2">Shipping Address</h3>
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
        <div>
          <h3 className="eyebrow mb-2">Total</h3>
          <p className="text-lg text-ink">{formatPrice(order.total_price)}</p>
        </div>
      </div>

      {order.status === "pending" ? (
        <Button
          variant="outline"
          onClick={() =>
            cancelOrder.mutate(order.id, {
              onSuccess: () => push("Order canceled."),
              onError: (err) => push(getErrorMessage(err), "error"),
            })
          }
          loading={cancelOrder.isPending}
        >
          Cancel Order
        </Button>
      ) : null}
    </AccountLayout>
  );
}
