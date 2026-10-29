"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../../lib/validations/auth";

import { api } from "../../../lib/axios/axios";

export default function ForgotForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

    try {
      await api.post("/auth/forgot-password", {
        email: data.email,
      });

      setSuccessMessage(
        "If an account exists with this email, we have sent a password reset link."
      );
    } catch (error: unknown) {
      console.error("Forgot password error:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-0 text-foreground sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden p-4 sm:rounded-3xl sm:border sm:border-border/60 sm:bg-card/80 sm:p-8 sm:shadow-2xl sm:backdrop-blur-xl">
          <div className="absolute -top-24 right-0 hidden h-48 w-48 rounded-full bg-primary/20 blur-3xl sm:block" />
          <div className="absolute -bottom-28 left-10 hidden h-56 w-56 rounded-full bg-accent/15 blur-3xl sm:block" />

          <div className="relative">
            <div className="mb-2 flex justify-center sm:mb-8">
              <Link href="/" className="text-glow text-xl font-bold tracking-tight sm:text-2xl">
                MyChat
              </Link>
            </div>

            <div className="mb-2 text-center sm:mb-8">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Forgot your password?
              </h1>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">
                Enter your email address and we&apos;ll send you a link
                to reset your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium sm:mb-2"
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
                  className={`w-full rounded-2xl border px-4 py-2.5 text-base outline-none sm:py-3 sm:text-sm transition bg-input/80 ${
                    errors.email
                      ? "border-destructive focus:ring-1 focus:ring-destructive"
                      : "border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/60"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {successMessage && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <div className="mt-3 text-center sm:mt-5">
              <Link
                href="/login"
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline sm:text-sm"
              >
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
