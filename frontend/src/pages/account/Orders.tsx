import { Link } from "react-router-dom";
import { useMyOrders } from "@/hooks/useOrders";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/format";

export function Orders() {
  const { data: orders, isLoading } = useMyOrders();

  return (
    <AccountLayout>
      {isLoading ? (
        <Spinner />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it will show up here."
          action={
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/account/orders/${order.id}`} className="flex items-center justify-between gap-4 py-5 hover:bg-cream-soft">
                <div>
                  <p className="text-sm text-ink">Order #{order.id}</p>
                  <p className="text-xs text-ink-soft">{formatDate(order.created_at)} · {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-ink">{formatPrice(order.total_price)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}
