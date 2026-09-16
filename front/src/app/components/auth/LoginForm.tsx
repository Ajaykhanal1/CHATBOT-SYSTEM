"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className=" text-black flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            MyChat
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue chatting with AI
          </p>
        </div>

        {/* Google Login */}
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

        {/* Login Form */}
        <form className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs text-gray-500 hover:text-black hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-16 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 text-sm text-gray-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />

            Remember me
          </label>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Sign in
          </button>
        </form>

        {/* Register */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Dont have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}