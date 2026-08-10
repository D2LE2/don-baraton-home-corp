export function formatUsd(amount: number, compact = false) {
  if (compact && amount >= 1000) {
    const k = amount / 1000;
    const rounded = Number.isInteger(k) ? k.toFixed(0) : k.toFixed(0);
    return `$${rounded}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function savingsAmount(priceFrom: number, marketValue: number) {
  return Math.max(0, marketValue - priceFrom);
}

export function savingsPercent(priceFrom: number, marketValue: number) {
  if (marketValue <= 0) return 0;
  return Math.round(((marketValue - priceFrom) / marketValue) * 100);
}
