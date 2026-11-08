import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Please enter a valid email address")
    .refine((email) => !/\s/.test(email), "Email cannot contain spaces")
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
      "Please enter a valid email address",
    )
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),

  acceptedTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
