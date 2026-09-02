import clsx from "clsx";
import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-mist text-ink-soft",
  shipped: "bg-taupe/30 text-taupe-dark",
  delivered: "bg-ink text-cream",
  canceled: "bg-rust/10 text-rust",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={clsx("px-2.5 py-1 text-[10px] uppercase tracking-wider", styles[status])}>{status}</span>
  );
}
