import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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

  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
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
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>; 


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;

