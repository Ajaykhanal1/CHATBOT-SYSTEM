"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";

import { api } from "@/lib/axios/axios";
import type { PaymentRecord } from "../../components/payments/types";

type ResultStatus =
  | "verifying"
  | "paid"
  | "pending"
  | "failed"
  | "cancelled"
  | "expired"
  | "error";

const npr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "We could not verify this payment. Please try again."
    );
  }

  return error instanceof Error
    ? error.message
    : "We could not verify this payment. Please try again.";
}

export default function PaymentResult({
  data,
  pidx,
}: {
  data: string | null;
  pidx: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ResultStatus>("verifying");
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  const verify = async () => {
    if (!data && !pidx) {
      setStatus("error");
      setMessage("The payment response is missing from this page.");
      return;
    }

    setStatus("verifying");
    setMessage("");

    try {
      const response = data
        ? await api.post("/payments/esewa/verify", { data })
        : await api.post("/payments/khalti/verify", { pidx });

      const nextStatus = String(response.data.status || "pending") as ResultStatus;

      setPayment((response.data.payment as PaymentRecord) ?? null);
      setStatus(nextStatus);
      setMessage(response.data.message || "");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const body = error.response?.data as
          | {
              status?: string;
              message?: string;
              payment?: PaymentRecord;
            }
          | undefined;

        setPayment(body?.payment ?? null);
        setMessage(body?.message || errorMessage(error));
        setStatus(
          body?.status && body.status !== "verifying"
            ? (body.status as ResultStatus)
            : "error",
        );
        return;
      }

      setStatus("error");
      setMessage(errorMessage(error));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const next = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (started.current) return;
    started.current = true;

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (status !== "paid") return;

    const timer = window.setTimeout(() => router.replace("/chat"), 2200);

    return () => window.clearTimeout(timer);
  }, [status, router]);

  const retryPlan =
    payment?.planId ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("paymentPlan")
      : null) ||
    "pro";

  if (status === "verifying") {
    return (
      <div className="rounded-3xl border border-border bg-card/90 p-8 text-center shadow-2xl">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
        <h1 className="mt-5 text-xl font-semibold">Verifying your payment</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Please wait while we confirm the transaction directly with the payment
          gateway. Do not close this window.
        </p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="rounded-3xl border border-emerald-400/30 bg-card/90 p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {payment?.planName || "Your plan"} access is now active for this
          account.
        </p>

        <div className="mt-6 space-y-2 rounded-2xl border border-border bg-background/40 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium">{payment?.planName || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Amount paid</span>
            <span className="font-medium">
              NPR {payment ? npr.format(payment.amountNpr) : "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Reference</span>
            <span className="truncate font-mono text-xs">
              {payment?.reference || "—"}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Redirecting you to chat...
        </p>

        <button
          type="button"
          onClick={() => router.replace("/chat")}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go to Chat
        </button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="rounded-3xl border border-amber-400/30 bg-card/90 p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10">
          <Clock3 className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Payment pending</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {message ||
            "The gateway has not confirmed this payment yet. Access is not active until it does."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={verify}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Check again
          </button>
          <Link
            href="/chat"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border px-5 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            Back to chat
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-3xl border border-border bg-card/90 p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10">
          <AlertTriangle className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Verification incomplete</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {message || "We could not verify this payment."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={verify}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Retry verification
          </button>
          <Link
            href={`/payment?plan=${retryPlan}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-border px-5 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            Try payment again
          </Link>
        </div>
      </div>
    );
  }

  const title =
    status === "cancelled"
      ? "Payment cancelled"
      : status === "expired"
        ? "Payment session expired"
        : "Payment failed";

  return (
    <div className="rounded-3xl border border-destructive/30 bg-card/90 p-8 text-center shadow-2xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {message || "This payment was not completed, so no access was activated."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/payment?plan=${retryPlan}`}
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
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
