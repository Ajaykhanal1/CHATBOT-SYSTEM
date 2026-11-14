import { z } from "zod";

export const quoteSchema = z.object({
  plan: z.enum(["pro", "business"]),
});

export const initiatePaymentSchema = z.object({
  planId: z.enum(["pro", "business"]),
  provider: z.enum(["esewa", "khalti"]),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{7,15}$/, "Phone number must contain 7 to 15 digits")
    .optional(),
});

export const esewaCallbackSchema = z.object({
  data: z.string().min(1, "Missing eSewa response"),
});

export const khaltiCallbackSchema = z.object({
  pidx: z.string().trim().min(1, "Missing Khalti payment id"),
});

export const esewaFailureSchema = z.object({
  data: z.string().optional(),
});
