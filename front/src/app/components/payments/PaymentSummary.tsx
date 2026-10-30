"use client";

import type { PaymentProvider, PlanQuote } from "./types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const npr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const providerNames: Record<PaymentProvider, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
};

export default function PaymentSummary({
  plan,
  amountNpr,
  provider,
}: {
  plan: PlanQuote;
  amountNpr: number;
  provider: PaymentProvider;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-2xl shadow-black/20">
      <div className="border-b border-border p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Payment summary
        </p>
        <h2 className="mt-2 text-xl font-semibold">{plan.name} plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan.durationDays} days of access
        </p>
      </div>

      <div className="space-y-3 p-5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Plan price</span>
          <span className="font-medium">{usd.format(plan.amountUsd)}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Payment method</span>
          <span className="font-medium">{providerNames[provider]}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Billing currency</span>
          <span className="font-medium">NPR</span>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="flex items-end justify-between gap-4">
          <span className="text-muted-foreground">You pay</span>
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight">
              NPR {npr.format(amountNpr)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {usd.format(plan.amountUsd)} at today&apos;s selling rate
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background/40 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
        The amount is calculated on the server. Access is activated only after
        the gateway confirms the payment.
      </div>
    </div>
  );
}
