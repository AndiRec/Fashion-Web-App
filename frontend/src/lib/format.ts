export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} ден.`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function categoryLabel(value: string): string {
  if (value === "tshirt") return "T-Shirt";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
