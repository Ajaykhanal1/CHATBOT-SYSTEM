import Link from "next/link";
import ThemeToggle from "@/components/theme/theme-toggle";


export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <h1 className="text-7xl font-bold">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Go to Home
      </Link>
    </main>
  );
}
