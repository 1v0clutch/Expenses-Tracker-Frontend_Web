export function money(amount: number, currency = "PHP") {
  const locales: Record<string, string> = {
    PHP: "en-PH",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
  };
  try {
    return new Intl.NumberFormat(locales[currency] || "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
export function monthMatch(value: string) {
  const d = new Date(`${value}T00:00:00`),
    n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
export function weekMatch(value: string) {
  const d = new Date(`${value}T00:00:00`),
    n = new Date();
  const start = new Date(n);
  start.setHours(0, 0, 0, 0);
  start.setDate(n.getDate() - 6);
  return d >= start && d <= n;
}
