"use client";

import { CheckCircle2 } from "lucide-react";
import type { PaymentProvider } from "./types";

const methods: Array<{
  id: PaymentProvider;
  name: string;
  description: string;
  accent: string;
  badge: string;
  badgeClass: string;
}> = [
  {
    id: "esewa",
    name: "eSewa",
    description: "Pay with your eSewa wallet",
    accent: "border-emerald-400/70 bg-emerald-400/10",
    badge: "eSewa",
    badgeClass: "bg-emerald-500 text-white",
  },
  {
    id: "khalti",
    name: "Khalti",
    description: "Pay with your Khalti wallet",
    accent: "border-violet-400/70 bg-violet-400/10",
    badge: "khalti",
    badgeClass: "bg-violet-600 text-white",
  },
];

export default function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {methods.map((method) => {
        const selected = value === method.id;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            disabled={disabled}
            aria-pressed={selected}
            className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              selected
                ? `${method.accent} shadow-lg`
                : "border-border bg-card/60 hover:border-white/20 hover:bg-card"
            }`}
          >
            <span
              className={`flex h-11 w-16 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${method.badgeClass}`}
            >
              {method.badge}
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold">{method.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {method.description}
              </span>
            </span>

            {selected && (
              <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
