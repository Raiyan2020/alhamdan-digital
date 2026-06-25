import { z } from "zod";
import { validationMessages } from "@/lib/validation/messages";

export const adminLoginSchema = z.object({
  email: z.string().email(validationMessages.invalidEmail),
  password: z.string().min(1, validationMessages.passwordRequired),
  remember: z.boolean().optional().default(false),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
