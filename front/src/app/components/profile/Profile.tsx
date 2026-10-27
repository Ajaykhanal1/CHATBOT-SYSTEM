"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Mail, Calendar, Shield, LogOut } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
    router.refresh();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-noise" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-grid opacity-30" />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition-all hover:border-white/20 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Chat
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
            </span>
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              MyChat
            </span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl shadow-primary/10 backdrop-blur">
          <div className="relative px-6 py-10 sm:px-10">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 blur-3xl" />
            <div className="absolute -right-24 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-60 blur-lg" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-semibold text-primary-foreground">
                  {initials}
                </div>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <span>Active Account</span>
                </div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {user?.name || "Your Profile"}
                </h1>
                <p className="text-balance text-lg text-muted-foreground">
                  Manage your account details and session
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-lg font-semibold">Account Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your personal details</p>
              </div>
            </div>
            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
              <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent p-5">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/30 blur-3xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-cyan-100/80">Email Address</p>
                    <p className="mt-1 truncate text-sm font-medium">{user?.email || "Not available"}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent p-5">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100/80">Account Role</p>
                    <p className="mt-1 text-sm font-medium capitalize">{user?.role || "User"}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-5 sm:col-span-2">
                <div className="absolute -right-16 -top-12 h-28 w-28 rounded-full bg-amber-400/30 blur-3xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-100/80">Member Since</p>
                    <p className="mt-1 text-sm font-medium">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
              <div className="px-6 py-6 sm:px-8">
                <h2 className="text-lg font-semibold">Plan</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your current subscription</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-semibold">Free</p>
                    <p className="mt-1 text-sm text-muted-foreground">Basic access to all models</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    Active
                  </span>
                </div>
                <Link
                  href="/#pricing"
                  className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
                >
                  <span className="relative z-10">Upgrade Plan</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
              <div className="px-6 py-6 sm:px-8">
                <h2 className="text-lg font-semibold">Session</h2>
                <p className="mt-1 text-sm text-muted-foreground">Sign out of your account</p>
                <AlertDialog>
                  <AlertDialogTrigger className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-foreground transition-all hover:border-white/20 hover:bg-white/10">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-white/10 bg-background/95 text-foreground backdrop-blur-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        You will need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/10 bg-white/5 text-foreground hover:bg-white/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      >
                        Log out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}