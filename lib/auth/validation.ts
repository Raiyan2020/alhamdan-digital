import { z } from "zod";
import { validationMessages } from "@/lib/validation/messages";

export const adminLoginSchema = z.object({
  email: z.string().email(validationMessages.invalidEmail),
  password: z.string().min(1, validationMessages.passwordRequired),
  remember: z.boolean().optional().default(false),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const adminProfileSchema = z.object({
  name: z.string().trim().min(1, validationMessages.required).max(191),
  email: z.string().trim().toLowerCase().email(validationMessages.invalidEmail),
  currentPassword: z.string().min(1, validationMessages.passwordRequired),
});

export const adminPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, validationMessages.passwordRequired),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, validationMessages.passwordRequired),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type AdminProfileInput = z.infer<typeof adminProfileSchema>;
export type AdminPasswordChangeInput = z.infer<typeof adminPasswordChangeSchema>;
