import ForgotForm from "../components/auth/ForgotForm";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <ForgotForm />
      </div>
    </main>
  );
}