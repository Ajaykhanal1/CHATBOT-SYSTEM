"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
          </span>
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            MyChat
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#models" className="transition-colors hover:text-foreground">
            Models
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
          <a href="#contact" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <span className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-sm text-muted-foreground">
                Hi, {user.name?.split(" ")[0] || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex rounded-full px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex rounded-full px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-full px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/chat"
            className="group relative inline-flex items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <span className="relative z-10">{user ? "Go to Chat" : "Try Now"}</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
        </div>
      </div>
    </nav>
  );
}