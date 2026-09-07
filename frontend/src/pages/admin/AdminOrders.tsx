import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Select } from "@/components/ui/Field";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchIcon } from "@/components/icons";
import { formatDate, formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["pending", "shipped", "delivered", "canceled"];

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useAdminOrders({ status: statusFilter, search: debouncedSearch, page });
  const updateStatus = useUpdateOrderStatus();
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex max-w-sm flex-1 items-center gap-2 border border-line bg-cream-soft px-3">
          <SearchIcon width={16} height={16} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order #, name, phone…"
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
          />
        </div>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | "");
            setPage(1);
          }}
          className="w-auto"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto border border-line bg-cream">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-soft text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-line ${isFetching ? "opacity-60" : ""}`}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState title="No orders found" description="Try a different search or status filter." />
                </td>
              </tr>
            ) : (
              data?.data.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="cursor-pointer hover:bg-cream-soft/60"
                >
                  <td className="px-4 py-3">
                    <span className="link-underline text-ink">#{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{order.customer?.name}</p>
                    <p className="text-xs text-ink-soft">{order.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(order.total_price)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.meta.last_page > 1 ? (
        <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
      ) : null}
    </AdminLayout>
  );
}
