"use client";

import { AlertTriangle, CalendarClock, RefreshCw } from "lucide-react";
import type { ExchangeRateSnapshot } from "./types";

const npr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExchangeRateDisplay({
  exchangeRate,
}: {
  exchangeRate: ExchangeRateSnapshot;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Exchange rate</span>
        </div>
        <span className="text-sm font-semibold">
          1 USD = NPR {npr.format(exchangeRate.rate)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarClock className="h-3.5 w-3.5" />
          Rate date: {formatDate(exchangeRate.rateDate)}
        </span>
        <span>Source: {exchangeRate.source}</span>
      </div>

      {exchangeRate.fallback && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          The official NRB rate is unavailable. The amount below uses a clearly
          marked backup rate.
        </div>
      )}
    </div>
  );
}
