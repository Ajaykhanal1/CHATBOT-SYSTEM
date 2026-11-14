export type PaymentProvider = "esewa" | "khalti";

export interface PlanQuote {
  id: "pro" | "business";
  name: string;
  description: string;
  amountUsd: number;
  durationDays: number;
}

export interface ExchangeRateSnapshot {
  base: "USD";
  quote: "NPR";
  rate: number;
  rateDate: string;
  source: string;
  fallback: boolean;
  fetchedAt: string;
}

export interface ActiveAccess {
  plan: "free" | "pro" | "business";
  planName: string;
  expiresAt: string | null;
  paymentId: string | null;
}

export interface QuoteResponse {
  success: boolean;
  plan: PlanQuote;
  exchangeRate: ExchangeRateSnapshot;
  amountNpr: number;
  access: ActiveAccess;
}

export interface PaymentRecord {
  reference: string;
  planId: "pro" | "business";
  planName: string;
  provider: PaymentProvider;
  status: "pending" | "paid" | "failed" | "cancelled" | "expired";
  amountUsd: number;
  amountNpr: number;
  currency: "NPR";
  exchangeRate: number;
  rateDate: string;
  paidAt: string | null;
  accessEndsAt: string | null;
}
