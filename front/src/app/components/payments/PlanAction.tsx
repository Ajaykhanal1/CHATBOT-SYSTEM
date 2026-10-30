"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/axios/axios";

export default function PlanAction({
  planId,
  className,
  children,
}: {
  planId: "pro" | "business";
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const handleClick = async () => {
    if (checking) return;

    if (!localStorage.getItem("token")) {
      router.push(
        `/login?next=${encodeURIComponent(`/payment?plan=${planId}`)}`,
      );
      return;
    }

    setChecking(true);

    try {
      const response = await api.get<{ plan: string }>("/payments/access");
      const plan = response.data.plan;

      if (plan === "business" || plan === planId) {
        router.push("/chat");
        return;
      }
    } catch {
      // Fall through to the payment page; it handles auth/API errors.
    } finally {
      setChecking(false);
    }

    router.push(`/payment?plan=${planId}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={checking}
      aria-busy={checking}
      className={className}
    >
      {checking ? "Checking access..." : children}
    </button>
  );
}
