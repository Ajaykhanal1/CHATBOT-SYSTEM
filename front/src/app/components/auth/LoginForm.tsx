"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../../lib/validations/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/axios/axios";
import { useGoogleLogin } from "@react-oauth/google";

import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const goAfterLogin = (role: string) => {
    if (typeof window !== "undefined") {
      const next = new URLSearchParams(window.location.search).get("next");

      if (next && next.startsWith("/") && !next.startsWith("//")) {
        router.push(next);
        return;
      }
    }

    if (role === "admin") {
      router.push("/admin_pages/dashboard");
    } else {
      router.push("/chat");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setApiError("");
      setIsLoading(true);

      try {
        // Send Google information to your backend
        const response = await api.post("/auth/google", {
          credential: tokenResponse.access_token,
        });

        const { token, user } = response.data;

        // Save login information
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        goAfterLogin(user.role);
      } catch (error: unknown) {
        console.error("Google login error:", error);

        if (axios.isAxiosError(error)) {
          setApiError(
            error.response?.data?.message ||
            "Google login failed."
          );
        } else {
          setApiError("Google login failed.");
        }
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      setApiError("Google login failed.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      goAfterLogin(user.role);
      
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message ||
          "Invalid email or password."
        );
      } else {
        setApiError("Something went wrong during login.");
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
            {/* Logo */}
            <div className="mb-2 text-center md:mb-6 lg:mb-8">
              <Link href="/" className="text-glow text-xl font-bold tracking-tight md:text-3xl lg:text-2xl">
                MyChat
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight md:text-4xl lg:text-3xl">Welcome back</h1>
              <p className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-lg lg:text-sm">
                Sign in to continue chatting with AI
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              disabled={isLoading}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-secondary/60 px-4 py-2.5 md:mt-6 md:py-3 text-sm font-medium transition hover:bg-secondary md:text-lg lg:text-sm disabled:opacity-50"
              onClick={() => googleLogin()}
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
            <div className="my-3 flex items-center gap-4 md:my-6 lg:my-7">
              <div className="h-px flex-1 bg-border/70" />
              <span className="text-xs text-muted-foreground md:text-sm lg:text-xs">OR</span>
              <div className="h-px flex-1 bg-border/70" />
            </div>

            {/* API Error Alert */}
            {apiError && (
              <div className="mb-4 rounded-2xl border border-destructive/60 bg-destructive/10 p-3 text-center text-xs text-destructive md:text-sm lg:text-xs">
                {apiError}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 md:space-y-4 lg:space-y-5"
              noValidate
            >
              {/* Email/Username */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium md:mb-2 md:text-lg lg:text-sm"
                >
                  Email or Username
                </label>

                <input
                  id="email"
                  type="text"
                  placeholder="you@example.com or admin"
                  autoComplete="username"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className={`w-full rounded-2xl border px-4 py-2.5 md:py-3 text-base lg:py-3 md:text-lg outline-none lg:text-sm transition bg-input/80 ${errors.email
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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium md:text-lg lg:text-sm"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline md:text-lg lg:text-sm"
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
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className={`w-full rounded-2xl border px-4 py-2.5 md:py-3 pr-20 text-base md:text-lg outline-none lg:py-3 lg:text-sm transition bg-input/80 ${errors.password
                      ? "border-destructive focus:ring-1 focus:ring-destructive"
                      : "border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/60"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground md:text-lg lg:text-sm"
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

              {/* Remember Me */}
              <div>
                <label className="flex cursor-pointer items-center gap-3 text-xs text-muted-foreground md:text-lg lg:text-sm">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-4 w-4 rounded border-border/80 bg-input/80 text-primary focus:ring-primary"
                  />

                  <span>Remember me</span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 md:py-3 md:text-lg font-medium text-primary-foreground lg:text-base transition hover:opacity-90 disabled:opacity-50 lg:py-3"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Register */}
            <p className="mt-3 text-center text-xs text-muted-foreground md:mt-6 md:text-lg lg:text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}