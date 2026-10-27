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
    <div className="flex min-h-screen items-center justify-center px-6 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="card-glow relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Link href="/" className="text-glow text-2xl font-bold tracking-tight">
                MyChat
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset password
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create a new password for your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
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
                    className={`w-full rounded-2xl border px-4 py-3 pr-20 text-sm outline-none transition bg-input/80 ${
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
                  className="mb-2 block text-sm font-medium"
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
                    className={`w-full rounded-2xl border px-4 py-3 pr-20 text-sm outline-none transition bg-input/80 ${
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
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
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
