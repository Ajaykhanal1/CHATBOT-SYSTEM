export interface ExchangeRateSnapshot {
  base: "USD";
  quote: "NPR";
  rate: number;
  rateDate: string;
  source: string;
  fallback: boolean;
  fetchedAt: string;
}

export class ExchangeRateError extends Error {
  statusCode = 503;

  constructor(message: string) {
    super(message);
    this.name = "ExchangeRateError";
  }
}

const NRB_URL =
  process.env.EXCHANGE_RATE_API_URL ||
  "https://www.nrb.org.np/api/forex/v1/rates";

const FALLBACK_URL = "https://open.er-api.com/v6/latest/USD";

const CACHE_MINUTES = Number(process.env.EXCHANGE_RATE_CACHE_MINUTES || 360);

let cache: { rate: ExchangeRateSnapshot; expiresAt: number } | null = null;

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isFiniteRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

async function fetchNrbRate(): Promise<ExchangeRateSnapshot | null> {
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);

  const url = new URL(NRB_URL);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "10");
  url.searchParams.set("from", isoDate(from));
  url.searchParams.set("to", isoDate(to));

  const response = await fetch(url, {
    // NRB closes bare undici requests, so send browser-like headers.
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`NRB responded with ${response.status}`);
  }

  const body = (await response.json()) as {
    data?: {
      payload?: Array<{
        date?: string;
        rates?: Array<{
          currency?: { iso3?: string; unit?: number };
          sell?: string;
        }>;
      }>;
    };
  };

  // NRB returns the requested window oldest-first; use the newest day.
  for (const day of [...(body.data?.payload ?? [])].reverse()) {
    const usd = day.rates?.find((item) => item.currency?.iso3 === "USD");

    if (!usd?.sell) continue;

    const rate = Number(usd.sell) / (usd.currency?.unit || 1);

    if (!isFiniteRate(rate)) continue;

    return {
      base: "USD",
      quote: "NPR",
      rate,
      rateDate: day.date || isoDate(to),
      source: "Nepal Rastra Bank (selling rate)",
      fallback: false,
      fetchedAt: new Date().toISOString(),
    };
  }

  return null;
}

async function fetchBackupRate(): Promise<ExchangeRateSnapshot | null> {
  const response = await fetch(FALLBACK_URL, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Backup exchange-rate API responded with ${response.status}`);
  }

  const body = (await response.json()) as {
    result?: string;
    rates?: { NPR?: number };
    time_last_update_unix?: number;
  };

  const rate = body.rates?.NPR;

  if (body.result !== "success" || !isFiniteRate(rate)) {
    return null;
  }

  const updated = body.time_last_update_unix
    ? new Date(body.time_last_update_unix * 1000)
    : new Date();

  return {
    base: "USD",
    quote: "NPR",
    rate,
    rateDate: isoDate(updated),
    source: "open.er-api.com (backup source)",
    fallback: true,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Returns a fresh USD -> NPR selling rate.
 * Policy: NRB first, then a marked backup provider. If both fail we refuse the
 * payment instead of silently charging with an outdated rate.
 */
export async function getUsdNprRate(): Promise<ExchangeRateSnapshot> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.rate;
  }

  try {
    const nrb = await fetchNrbRate();

    if (nrb) {
      cache = {
        rate: nrb,
        expiresAt: Date.now() + CACHE_MINUTES * 60 * 1000,
      };
      return nrb;
    }
  } catch (error) {
    console.error(
      "NRB exchange-rate lookup failed:",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const backup = await fetchBackupRate();

    if (backup) {
      cache = {
        rate: backup,
        expiresAt: Date.now() + CACHE_MINUTES * 60 * 1000,
      };
      return backup;
    }
  } catch (error) {
    console.error(
      "Backup exchange-rate lookup failed:",
      error instanceof Error ? error.message : error,
    );
  }

  throw new ExchangeRateError(
    "USD to NPR exchange rate is currently unavailable. Please try again later.",
  );
}
