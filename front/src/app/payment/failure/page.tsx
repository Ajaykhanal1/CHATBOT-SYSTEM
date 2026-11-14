import PaymentFailure from "./payment-failure";

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const data = typeof params.data === "string" ? params.data : null;
  const plan = typeof params.plan === "string" ? params.plan : null;

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10 w-full max-w-lg">
        <PaymentFailure data={data} plan={plan} />
      </div>
    </main>
  );
}
