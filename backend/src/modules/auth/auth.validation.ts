import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  username: z.string().trim().min(1),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(6)
});
