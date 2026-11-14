import Link from "next/link";

import PaymentClient from "./payment-client";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : undefined;

  if (plan !== "pro" && plan !== "business") {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Choose a plan first</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This payment page needs a valid Pro or Business plan.
          </p>
          <Link
            href="/#pricing"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View plans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative z-10">
        <PaymentClient planId={plan} />
      </div>
    </main>
  );
}
