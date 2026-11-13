import LoginForm from "../components/auth/LoginForm";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function LoginPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </main>
  );
}