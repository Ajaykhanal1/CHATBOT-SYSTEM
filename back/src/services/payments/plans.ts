export type PlanId = "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  amountUsd: number;
  durationDays: number;
}

// USD prices are the source of truth. The frontend only displays them.
export const PLANS: Record<PlanId, Plan> = {
  pro: {
    id: "pro",
    name: "Pro",
    description: "More AI messages, advanced models and priority access.",
    amountUsd: 19,
    durationDays: 30,
  },
  business: {
    id: "business",
    name: "Business",
    description: "Everything in Pro plus higher limits and team features.",
    amountUsd: 49,
    durationDays: 30,
  },
};

export const PLAN_IDS: PlanId[] = ["pro", "business"];

export function getPlan(id: unknown): Plan | null {
  if (id === "pro" || id === "business") {
    return PLANS[id];
  }

  return null;
}
