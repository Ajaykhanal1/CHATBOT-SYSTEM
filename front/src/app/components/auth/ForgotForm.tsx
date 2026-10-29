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
    <div className="flex min-h-[100dvh] items-center justify-center p-0 text-foreground md:px-8 md:py-10 lg:px-8 lg:py-12">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-md">
        <div className="relative overflow-hidden p-4 md:p-8 lg:rounded-3xl lg:border lg:border-border/60 lg:bg-card/80 lg:p-8 lg:shadow-2xl lg:backdrop-blur-xl">
          <div className="absolute -top-24 right-0 hidden h-48 w-48 rounded-full bg-primary/20 blur-3xl lg:block" />
          <div className="absolute -bottom-28 left-10 hidden h-56 w-56 rounded-full bg-accent/15 blur-3xl lg:block" />

          <div className="relative">
            <div className="mb-2 flex justify-center md:mb-6 lg:mb-8">
              <Link href="/" className="text-glow text-xl font-bold tracking-tight md:text-3xl lg:text-2xl">
                MyChat
              </Link>
            </div>

            <div className="mb-2 text-center md:mb-6 lg:mb-8">
              <h1 className="text-xl font-semibold tracking-tight md:text-4xl lg:text-2xl">
                Forgot your password?
              </h1>

              <p className="mt-1 text-xs leading-5 text-muted-foreground md:mt-2 md:text-lg lg:text-sm md:leading-6">
                Enter your email address and we&apos;ll send you a link
                to reset your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 md:space-y-4 lg:space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium md:mb-2 md:text-lg lg:text-sm"
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
                  className={`w-full rounded-2xl border px-4 py-2.5 md:py-3 text-base md:text-lg outline-none lg:py-3 lg:text-sm transition bg-input/80 ${
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
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300 md:text-lg lg:text-sm">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive md:text-lg lg:text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 md:py-3 md:text-lg font-medium text-primary-foreground lg:text-base transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 lg:py-3"
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

            <div className="mt-3 text-center md:mt-4 lg:mt-5">
              <Link
                href="/login"
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline md:text-lg lg:text-sm"
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
