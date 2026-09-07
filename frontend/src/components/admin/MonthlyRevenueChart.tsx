import { useState } from "react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import type { MonthlyRevenuePoint } from "@/hooks/useOrders";

export function MonthlyRevenueChart({ data }: { data: MonthlyRevenuePoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((point) => point.revenue));

  return (
    <div>
      <div className="flex h-48 items-end gap-1.5 sm:gap-2">
        {data.map((point, i) => {
          const heightPct = Math.max(2, (point.revenue / max) * 100);
          const isHovered = hovered === i;
          return (
            <div
              key={point.month}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered ? (
                <div className="pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap border border-ink bg-ink px-2.5 py-1.5 text-center shadow-lg">
                  <p className="text-xs font-medium text-cream">{formatPrice(point.revenue)}</p>
                  <p className="text-[10px] text-cream/70">
                    {point.label} · {point.orders} {point.orders === 1 ? "order" : "orders"}
                  </p>
                </div>
              ) : null}
              <div
                className={clsx(
                  "w-full rounded-t-sm transition-colors",
                  isHovered ? "bg-rust" : point.revenue > 0 ? "bg-ink" : "bg-line",
                )}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {data.map((point) => (
          <span key={point.month} className="flex-1 text-center text-[10px] uppercase text-ink-soft">
            {point.label.split(" ")[0]}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Revenue by month, last 12 months</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <td>{point.label}</td>
              <td>{formatPrice(point.revenue)}</td>
              <td>{point.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
