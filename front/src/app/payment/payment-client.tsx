"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

import { api } from "@/lib/axios/axios";
import ExchangeRateDisplay from "../components/payments/ExchangeRateDisplay";
import PaymentMethodSelector from "../components/payments/PaymentMethodSelector";
import PaymentSummary from "../components/payments/PaymentSummary";
import type {
  PaymentProvider,
  QuoteResponse,
} from "../components/payments/types";

const npr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function messageFromError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Could not start the payment. Please try again."
    );
  }

  return error instanceof Error
    ? error.message
    : "Could not start the payment. Please try again.";
}

export default function PaymentClient({
  planId,
}: {
  planId: "pro" | "business";
}) {
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>("esewa");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace(
        `/login?next=${encodeURIComponent(`/payment?plan=${planId}`)}`,
      );
      return;
    }

    let active = true;

    api
      .get<QuoteResponse>("/payments/quote", { params: { plan: planId } })
      .then((response) => {
        if (!active) return;

        setQuote(response.data);

        if (
          response.data.access.plan === planId ||
          response.data.access.plan === "business"
        ) {
          router.replace("/chat");
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(messageFromError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [planId, router]);

  const handlePay = async () => {
    if (!quote || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      sessionStorage.setItem("paymentPlan", planId);

      const response = await api.post("/payments/initiate", {
        planId,
        provider,
      });

      if (response.data.alreadyActive) {
        router.replace("/chat");
        return;
      }

      if (response.data.method === "esewa") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = response.data.action;
        form.style.display = "none";

        Object.entries(response.data.fields as Record<string, string>).forEach(
          ([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          },
        );

        document.body.appendChild(form);
        form.submit();
        return;
      }

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

      throw new Error("The payment gateway did not return a checkout URL.");
    } catch (requestError) {
      setSubmitting(false);
      setError(messageFromError(requestError));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground" />
          Loading the latest exchange rate...
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Payment unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error || "We could not load this plan. Please try again."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <Link
              href="/#pricing"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-accent"
            >
              Back to plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/#pricing"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to plans
        </Link>

        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Secure checkout
        </span>
      </div>

      <div className="mb-8 max-w-2xl">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Upgrade to {quote.plan.name}
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Complete your payment
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pay in NPR with eSewa or Khalti. Your {quote.plan.name} access starts
          immediately after the payment is verified on our server.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <section className="rounded-3xl border border-border bg-card/70 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Payment method</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Choose the wallet you want to pay with.
                </p>
              </div>
            </div>

            <PaymentMethodSelector
              value={provider}
              onChange={setProvider}
              disabled={submitting}
            />
          </section>

          <section className="rounded-3xl border border-border bg-card/70 p-5 sm:p-6">
            <h2 className="text-base font-semibold">Exchange rate</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your plan price stays in USD. The payable amount is converted to
              NPR using the latest selling rate.
            </p>
            <div className="mt-4">
              <ExchangeRateDisplay exchangeRate={quote.exchangeRate} />
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                Redirecting to{" "}
                {provider === "esewa" ? "eSewa" : "Khalti"}...
              </>
            ) : (
              <>
                Pay NPR {npr.format(quote.amountNpr)} with{" "}
                {provider === "esewa" ? "eSewa" : "Khalti"}
              </>
            )}
          </button>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            We verify every transaction directly with the payment gateway. A
            browser redirect alone never activates access.
          </p>
        </div>

        <div className="lg:sticky lg:top-8">
          <PaymentSummary
            plan={quote.plan}
            amountNpr={quote.amountNpr}
            provider={provider}
          />
        </div>
      </div>
    </div>
  );
}
