import PaymentResult from "./payment-result";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const data = typeof params.data === "string" ? params.data : null;
  const pidx = typeof params.pidx === "string" ? params.pidx : null;

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10 w-full max-w-lg">
        <PaymentResult data={data} pidx={pidx} />
      </div>
    </main>
  );
}
