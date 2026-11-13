"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useTheme } from "./theme-provider";

const darkMedia = () => window.matchMedia("(prefers-color-scheme: dark)");
const subscribeSystemTheme = (onChange: () => void) => {
  const media = darkMedia();
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getSystemTheme = () => darkMedia().matches;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const systemIsDark = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    () => false,
  );

  // The stored theme is only known on the client, so the switch renders a
  // same-size placeholder until after hydration to keep the server markup identical.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark" || (theme === "system" && systemIsDark);

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {mounted ? (
        <Switch
          id="theme-dark"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Dark mode"
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-block h-[18.4px] w-8 shrink-0 rounded-full bg-input"
        />
      )}
      <Label
        htmlFor="theme-dark"
        className="cursor-pointer whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm"
      >
        Dark mode
      </Label>
    </div>
  );
}
