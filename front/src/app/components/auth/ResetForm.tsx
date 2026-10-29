"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../../lib/validations/auth";

import { api } from "../../../lib/axios/axios";

export default function ResetForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Invalid or missing reset link.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });

      setSuccessMessage(
        "Your password has been reset successfully."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Reset password error:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setErrorMessage(
          "Something went wrong. Please try again."
        );
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
            {/* Logo */}
            <div className="mb-2 flex justify-center sm:mb-8">
              <Link href="/" className="text-glow text-xl font-bold tracking-tight sm:text-2xl">
                MyChat
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-2 text-center sm:mb-8">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Reset password
              </h1>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">
                Create a new password for your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-5"
              noValidate
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium sm:mb-2"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className={`w-full rounded-2xl border px-4 py-2.5 pr-20 text-base outline-none sm:py-3 sm:text-sm transition bg-input/80 ${
                      errors.password
                        ? "border-destructive focus:ring-1 focus:ring-destructive"
                        : "border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/60"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium sm:mb-2"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    className={`w-full rounded-2xl border px-4 py-2.5 pr-20 text-base outline-none sm:py-3 sm:text-sm transition bg-input/80 ${
                      errors.confirmPassword
                        ? "border-destructive focus:ring-1 focus:ring-destructive"
                        : "border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/60"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Success */}
              {successMessage && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div className="rounded-2xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>

            {/* Back to Login */}
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
