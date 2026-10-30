import { Payment } from "../../models/Payment";

export interface ActiveAccess {
  plan: "free" | "pro" | "business";
  planName: string;
  expiresAt: string | null;
  paymentId: string | null;
}

export async function getActiveAccess(userId: string): Promise<ActiveAccess> {
  const now = new Date();

  const payments = await Payment.find({
    userId,
    status: "paid",
    accessEndsAt: { $gt: now },
  }).sort({ accessEndsAt: -1 });

  // Business is the higher tier. Prefer it when both are active.
  const payment =
    payments.find((item) => item.planId === "business") ?? payments[0];

  if (!payment) {
    return {
      plan: "free",
      planName: "Free",
      expiresAt: null,
      paymentId: null,
    };
  }

  return {
    plan: payment.planId,
    planName: payment.planName,
    expiresAt: payment.accessEndsAt?.toISOString() ?? null,
    paymentId: payment._id.toString(),
  };
}
