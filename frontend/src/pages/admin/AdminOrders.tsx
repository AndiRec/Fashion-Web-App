import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Field";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["pending", "shipped", "delivered", "canceled"];

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const { data, isLoading } = useAdminOrders(statusFilter);
  const updateStatus = useUpdateOrderStatus();
  const push = useToastStore((s) => s.push);

  return (
    <AdminLayout>
      <div className="mb-6">
        <Select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")} className="w-auto">
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream-soft text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data?.data.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{order.customer?.name}</p>
                    <p className="text-xs text-ink-soft">{order.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">{formatPrice(order.total_price)}</td>
                  <td className="px-4 py-3">
                    <Select
                      id={`status-${order.id}`}
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
                      className="w-auto py-2 text-xs capitalize"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
