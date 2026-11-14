"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

export default function CTA() {
  const user = useAuthStore((state) => state.user);

  return (
    <section id="contact" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[2.5rem] border border-border">
        <div className="relative px-6 py-16 text-center sm:px-12 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-accent/40 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--cta-glow),transparent_60%)]" />
          <span className="inline-flex rounded-full border border-border bg-muted/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            Ready when you are
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Your AI workspace awaits
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Chat, create, research and solve with every leading model in one seamless platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-xl shadow-primary/10 transition-all hover:-translate-y-0.5"
            >
              <span className="relative z-10">Start Chatting</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href={user ? "/chat" : "/register"}
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-base text-foreground backdrop-blur transition-all hover:border-foreground/30 hover:bg-accent"
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}