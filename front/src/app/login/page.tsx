import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </main>
  );
}