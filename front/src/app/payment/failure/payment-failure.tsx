"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";

import { api } from "@/lib/axios/axios";

export default function PaymentFailure({
  data,
  plan,
}: {
  data: string | null;
  plan: string | null;
}) {
  const [retryPlan, setRetryPlan] = useState(
    plan === "business" ? "business" : "pro",
  );

  useEffect(() => {
    if (!plan && typeof window !== "undefined") {
      const saved = sessionStorage.getItem("paymentPlan");

      if (saved === "pro" || saved === "business") {
        startTransition(() => setRetryPlan(saved));
      }
    }

    if (!data || !localStorage.getItem("token")) return;

    api.post("/payments/esewa/failure", { data }).catch(() => undefined);
  }, [data, plan]);

  return (
    <div className="rounded-3xl border border-destructive/30 bg-card/90 p-8 text-center shadow-2xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Payment not completed</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The transaction was cancelled or failed at the gateway. No access was
        activated and you have not been charged by us.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/payment?plan=${retryPlan}`}
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try payment again
        </Link>
        <Link
          href="/#pricing"
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border px-5 py-2.5 text-sm transition-colors hover:bg-accent"
        >
          Back to plans
        </Link>
      </div>
    </div>
  );
}
