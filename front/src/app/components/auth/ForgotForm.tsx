"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../../lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      // API call here
      console.log("Forgot password data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        "If an account exists with this email, we have sent a password reset link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Logo
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your email address and we&apos;ll send you a link
            to reset your password.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
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
              {...register("email")}
              aria-invalid={!!errors.email}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              }`}
            />

            {/* Validation Error */}
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
          >
            ← Back to login
          </Link>
        </div>

      </div>
    </div>
  );
}
