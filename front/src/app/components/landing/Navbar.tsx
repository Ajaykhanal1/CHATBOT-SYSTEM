"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <div className="text-xl font-bold">
          MyChat
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#models">Models</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 text-sm"
          >
            Login
          </a>
          <a href="/register">
  Get Started
</a>

          <Link
            href="/chat"
            className="rounded-full bg-black px-5 py-2.5 text-sm text-white"
          >
            Try Now
          </Link>
        </div>
      </div>
    </nav>
  );
}