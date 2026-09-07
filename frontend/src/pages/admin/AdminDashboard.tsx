import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminStats, type RevenueRange } from "@/hooks/useOrders";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { MonthlyRevenueChart } from "@/components/admin/MonthlyRevenueChart";
import { Select } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { AlertIcon, ClipboardIcon, PackageIcon } from "@/components/icons";
import { formatDate, formatPrice } from "@/lib/format";

const rangeOptions: { value: RevenueRange; label: string }[] = [
  { value: "all_time", label: "All Time" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "this_year", label: "This Year" },
];

export function AdminDashboard() {
  const [range, setRange] = useState<RevenueRange>("all_time");
  const { data: stats, isLoading } = useAdminStats(range);

  return (
    <AdminLayout
      title="Dashboard"
      actions={
        <Select
          id="revenue-range"
          value={range}
          onChange={(e) => setRange(e.target.value as RevenueRange)}
          className="w-auto"
        >
          {rangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      }
    >
      {isLoading || !stats ? (
        <Spinner />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={`Revenue · ${rangeOptions.find((o) => o.value === range)?.label}`} value={formatPrice(stats.total_revenue)} />
            <StatCard label="Orders" value={String(stats.total_orders)} />
            <StatCard
              label="Pending Orders"
              value={String(stats.pending_orders)}
              accent={stats.pending_orders > 0}
            />
            <StatCard label="Products" value={String(stats.total_products)} />
          </div>

          <div className="border border-line bg-cream p-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Monthly Revenue</h2>
              <p className="text-xs text-ink-soft">Last 12 months</p>
            </div>
            <MonthlyRevenueChart data={stats.monthly_revenue} />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="border border-line bg-cream">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="flex items-center gap-2 font-display text-lg text-ink">
                  <ClipboardIcon width={18} height={18} className="text-taupe-dark" />
                  Recent Orders
                </h2>
                <Link to="/admin/orders" className="link-underline text-xs uppercase tracking-wider text-ink-soft">
                  View All
                </Link>
              </div>
              {stats.recent_orders.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-soft">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {stats.recent_orders.map((order) => (
                    <li key={order.id}>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-cream-soft"
                      >
                        <div>
                          <p className="text-sm text-ink">
                            #{order.id} · {order.customer?.name}
                          </p>
                          <p className="text-xs text-ink-soft">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-ink">{formatPrice(order.total_price)}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-line bg-cream">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="flex items-center gap-2 font-display text-lg text-ink">
                  <AlertIcon width={18} height={18} className="text-rust" />
                  Low Stock
                </h2>
                <Link to="/admin/products" className="link-underline text-xs uppercase tracking-wider text-ink-soft">
                  Manage
                </Link>
              </div>
              {stats.low_stock_products.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-soft">All products are well stocked.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {stats.low_stock_products.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-cream-soft"
                      >
                        <div className="flex h-11 w-9 flex-shrink-0 items-center justify-center bg-mist text-ink-soft/40">
                          {product.images[0] ? (
                            <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <PackageIcon width={16} height={16} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-ink">{product.name}</p>
                          <p className="text-xs text-ink-soft">{product.total_stock ?? 0} units left</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-line bg-cream p-5">
      <p className="eyebrow mb-2 truncate">{label}</p>
      <p className={`font-display text-3xl ${accent ? "text-rust" : "text-ink"}`}>{value}</p>
    </div>
  );
}
