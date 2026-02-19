const CURRENCY_MAP: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  TRY: { symbol: "₺", locale: "tr-TR" },
  CAD: { symbol: "C$", locale: "en-CA" },
  AUD: { symbol: "A$", locale: "en-AU" },
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_MAP[currency]?.symbol || "$";
}

export function formatPrice(amount: number, currency: string = "USD"): string {
  const sym = getCurrencySymbol(currency);
  return `${sym}${new Intl.NumberFormat("en-US").format(amount)}`;
}
