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
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-noise" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-grid opacity-30" />

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-3 py-4 sm:gap-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-all hover:border-white/20 hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Chat
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xs font-medium sm:text-sm">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
            </span>
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              MyChat
            </span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl shadow-primary/10 backdrop-blur sm:rounded-[2.5rem]">
          <div className="relative px-4 py-6 sm:px-10 sm:py-10">
            <div className="relative flex flex-row items-center gap-4 text-left sm:gap-6">
              <div className="relative">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground sm:h-28 sm:w-28 sm:text-3xl">
                  {initials}
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground sm:px-3 sm:py-1">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <span>Active Account</span>
                </div>
                <h1 className="text-balance text-xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                  {user?.name || "Your Profile"}
                </h1>
                <p className="hidden text-balance text-base text-muted-foreground sm:block sm:text-lg">
                  Manage your account details and session
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-3 sm:px-8 sm:py-5">
              <div>
                <h2 className="text-base font-semibold sm:text-lg">Account Information</h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">Your personal details</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-2.5 py-2.5 sm:grid-cols-2 sm:gap-4 sm:px-8 sm:py-6">
              <div className="relative col-span-2 overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent p-2 sm:col-span-2 sm:p-5">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/30 blur-3xl" />
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white sm:h-10 sm:w-10">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-cyan-100/80 sm:text-sm">Email Address</p>
                    <p className="mt-0.5 truncate text-[11px] font-medium sm:mt-1 sm:text-sm">{user?.email || "Not available"}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent p-2 sm:p-5">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl" />
                <div className="relative flex items-center gap-1.5 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white sm:h-10 sm:w-10">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-emerald-100/80 sm:text-sm">Account Role</p>
                    <p className="mt-0.5 text-[11px] font-medium capitalize sm:mt-1 sm:text-sm">{user?.role || "User"}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-2 sm:p-5">
                <div className="absolute -right-16 -top-12 h-28 w-28 rounded-full bg-amber-400/30 blur-3xl" />
                <div className="relative flex items-center gap-1.5 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white sm:h-10 sm:w-10">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-100/80 sm:text-sm">Member Since</p>
                    <p className="mt-0.5 text-[11px] font-medium sm:mt-1 sm:text-sm">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
              <div className="px-2.5 py-3 sm:px-8 sm:py-6">
                <h2 className="text-sm font-semibold sm:text-lg">Plan</h2>
                <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-sm">Your current subscription</p>
                <div className="mt-2 flex items-end justify-between sm:mt-6">
                  <div>
                    <p className="text-xl font-semibold sm:text-3xl">Free</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-sm">Basic access to all models</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground sm:px-3 sm:py-1 sm:text-xs">
                    Active
                  </span>
                </div>
                <Link
                  href="/#pricing"
                  className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span className="relative z-10">Upgrade Plan</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur">
              <div className="flex h-full flex-col px-2.5 py-3 sm:px-8 sm:py-6">
                <div className="flex-1">
                  <h2 className="text-sm font-semibold sm:text-lg">Session</h2>
                  <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-sm">Sign out of your account</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-foreground transition-all hover:border-white/20 hover:bg-white/10 sm:mt-6 sm:px-6 sm:py-3 sm:text-sm">
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