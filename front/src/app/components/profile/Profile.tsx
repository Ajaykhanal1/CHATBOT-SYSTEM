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
    <div className="relative h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Chat
          </Link>
          <Link href="/" className="text-sm font-medium">
            MyChat
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="relative px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium sm:h-14 sm:w-14 sm:text-base">
                {initials}
              </div>
              <div>
                <div className="text-base font-semibold sm:text-lg">{user?.name || "Your Profile"}</div>
                <p className="text-sm text-muted-foreground">Manage your account details and session</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="border-b border-border px-4 py-3 sm:px-5 sm:py-4">
              <h2 className="text-sm font-medium">Account Information</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Your personal details</p>
            </div>
            <div className="space-y-2 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="truncate text-sm">{user?.email || "Not available"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Role</p>
                  <p className="text-sm capitalize">{user?.role || "User"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm">2026</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="px-4 py-3 sm:px-5 sm:py-4">
                <h2 className="text-sm font-medium">Plan</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Your current subscription</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-semibold">Free</p>
                    <p className="text-xs text-muted-foreground">Basic access to all models</p>
                  </div>
                  <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Active
                  </span>
                </div>
                <Link
                  href="/#pricing"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex flex-1 flex-col px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex-1">
                  <h2 className="text-sm font-medium">Session</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Sign out of your account</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
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