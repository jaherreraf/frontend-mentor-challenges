const BASE_URL = "https://api.frankfurter.dev/v1";

// ═══ INTERFACES ══════════════════════════════════════════════════════════════

export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

export interface TickerPair {
  pair: string;
  rate: string;
  changePercent: string;
  isUp: boolean;
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface StatsResult {
  open: number;
  last: number;
  change: number;
  changePercent: number;
}

// ═══ HELPERS INTERNOS ════════════════════════════════════════════════════════

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Frankfurter API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function getPreviousBusinessDate(daysBack: number): string {
  const d = new Date();
  let count = 0;
  while (count < daysBack) {
    d.setDate(d.getDate() - 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return d.toISOString().split("T")[0];
}

function crossRate(rates: Record<string, number>, from: string, to: string): number {
  if (from === "EUR") return rates[to];
  if (to === "EUR") return 1 / rates[from];
  return rates[to] / rates[from];
}

// ═══ MAPA MONEDA → BANDERA ═══════════════════════════════════════════════════
// ISO 4217 (moneda, 3 letras) → ISO 3166-1 alpha-2 (país, 2 letras, minúsculas)
// Coincide exactamente con el naming de los WebP del reto

export const CURRENCY_TO_FLAG: Record<string, string> = {
  AUD: "au", BGN: "bg", BRL: "br", CAD: "ca", CHF: "ch",
  CNY: "cn", CZK: "cz", DKK: "dk", EUR: "eu", GBP: "gb",
  HKD: "hk", HUF: "hu", IDR: "id", ILS: "il", INR: "in",
  ISK: "is", JPY: "jp", KRW: "kr", MXN: "mx", MYR: "my",
  NOK: "no", NZD: "nz", PHP: "ph", PLN: "pl", RON: "ro",
  SEK: "se", SGD: "sg", THB: "th", TRY: "tr", USD: "us",
  ZAR: "za",
};

export function getFlagUrl(currencyCode: string): string {
  const country = CURRENCY_TO_FLAG[currencyCode];
  return country ? `/assets/flags/${country}.webp` : "";
}

// ═══ PARES DEL TICKER ════════════════════════════════════════════════════════

const TICKER_PAIRS = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "JPY" },
  { from: "GBP", to: "USD" },
  { from: "USD", to: "CHF" },
  { from: "EUR", to: "GBP" },
  { from: "AUD", to: "USD" },
  { from: "USD", to: "CAD" },
];

// ═══ FUNCIONES PÚBLICAS ══════════════════════════════════════════════════════

export async function getLatestRates(base: string = "EUR"): Promise<LatestRatesResponse> {
  return apiFetch<LatestRatesResponse>(`/latest?from=${base}`);
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult> {
  const data = await apiFetch<LatestRatesResponse>(
    `/latest?amount=${amount}&from=${from}&to=${to}`
  );
  const rate = data.rates[to];
  return { from, to, amount, result: data.amount * rate, rate, date: data.date };
}

export async function getHistoricalRates(
  from: string,
  to: string,
  startDate: string,
  endDate: string
): Promise<ChartPoint[]> {
  const data = await apiFetch<{ rates: Record<string, Record<string, number>> }>(
    `/${startDate}..${endDate}?from=${from}&to=${to}`
  );
  return Object.entries(data.rates)
    .map(([date, rates]) => ({ time: date, value: rates[to] }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export async function getTickerPairs(): Promise<TickerPair[]> {
  const prevDate = getPreviousBusinessDate(2);
  const [latest, prev] = await Promise.all([
    apiFetch<LatestRatesResponse>("/latest?from=EUR"),
    apiFetch<LatestRatesResponse>(`/${prevDate}?from=EUR`),
  ]);

  console.log("[ticker] latest:", latest.date, "| prev:", prev.date);

  return TICKER_PAIRS.map(({ from, to }) => {
    const rate     = crossRate(latest.rates, from, to);
    const prevRate = crossRate(prev.rates, from, to);
    const change   = ((rate - prevRate) / prevRate) * 100;
    const isUp     = change >= 0;
    const decimals = to === "JPY" || from === "JPY" ? 2 : 4;
    return {
      pair: `${from}/${to}`,
      rate: rate.toFixed(decimals),
      changePercent: `${isUp ? "+" : ""}${change.toFixed(2)}%`,
      isUp,
    };
  });
}

export async function getPairStats(from: string, to: string): Promise<StatsResult> {
  const prevDate = getPreviousBusinessDate(1);
  const today    = new Date().toISOString().split("T")[0];
  const data     = await getHistoricalRates(from, to, prevDate, today);
  const open          = data[0]?.value ?? 0;
  const last          = data[data.length - 1]?.value ?? 0;
  const change        = last - open;
  const changePercent = open !== 0 ? (change / open) * 100 : 0;
  return { open, last, change, changePercent };
}

export function getDateRangeForPeriod(period: string): { startDate: string; endDate: string } {
  const end   = new Date();
  const start = new Date();
  switch (period) {
    case "1D": start.setDate(end.getDate() - 1);         break;
    case "1W": start.setDate(end.getDate() - 7);         break;
    case "1M": start.setMonth(end.getMonth() - 1);       break;
    case "3M": start.setMonth(end.getMonth() - 3);       break;
    case "1Y": start.setFullYear(end.getFullYear() - 1); break;
    case "5Y": start.setFullYear(end.getFullYear() - 5); break;
  }
  return {
    startDate: start.toISOString().split("T")[0],
    endDate:   end.toISOString().split("T")[0],
  };
}

export async function getCurrencies(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>("/currencies");
}