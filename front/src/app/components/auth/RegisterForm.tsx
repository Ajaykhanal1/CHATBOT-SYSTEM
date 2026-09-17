"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const newErrors = {
      name: "",
      email: "",
      password: "",
      terms: "",
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Terms validation
    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and privacy policy";
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (newErrors.name || newErrors.email || newErrors.password || newErrors.terms) {
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your API endpoint: e.g., await fetch("/api/auth/register", ...)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration data submitted:", {
        name,
        email,
        password,
        acceptedTerms,
      });
    } catch (err) {
      console.error("Registration error:", err);
      setApiError("Something went wrong during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 text-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
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

        {/* Google OAuth Button */}
        <button
          type="button"
          disabled={isLoading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs text-red-600">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              value={name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.name
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full rounded-xl border px-4 py-3 pr-20 text-sm outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: "" }));
                }}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-black underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-black underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-xs text-red-500">{errors.terms}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Login redirect */}
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