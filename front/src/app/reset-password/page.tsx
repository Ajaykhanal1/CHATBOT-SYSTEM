import { Suspense } from "react";

import ResetForm from "../components/auth/ResetForm";

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
