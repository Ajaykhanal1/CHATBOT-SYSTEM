"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className=" text-black flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/" className="text-2xl font-bold">
            MyChat
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Start chatting with AI today
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          <span className="font-bold">G</span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm text-gray-500">
            <input
              type="checkbox"
              className="mt-1"
            />

            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-black underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-black underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Register */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Create account
          </button>
        </form>

        {/* Login */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}