import crypto from "crypto";

// eSewa only allows letters, numbers and hyphens in transaction_uuid.
export function createPaymentReference(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `PAY-${time}-${random}`;
}

export function roundNpr(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
