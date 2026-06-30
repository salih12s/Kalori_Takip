import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta zorunludur")
    .email("Geçerli bir e-posta gir"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Kullanıcı adı zorunludur")
      .max(30, "Kullanıcı adı en fazla 30 karakter olmalı"),
    email: z
      .string()
      .min(1, "E-posta zorunludur")
      .email("Geçerli bir e-posta gir"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
