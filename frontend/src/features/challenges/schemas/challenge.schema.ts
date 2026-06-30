import { z } from "zod";

const CHALLENGE_TYPES = ["STEPS", "FOOD_LOG", "WORKOUT", "RUN_DISTANCE", "WATER"] as const;

export const createChallengeSchema = z
  .object({
    title: z.string().min(1, "Başlık zorunludur").max(120, "En fazla 120 karakter olmalı"),
    description: z.string().max(500, "En fazla 500 karakter olmalı").optional(),
    type: z
      .string()
      .min(1, "Tür seçiniz")
      .refine((value) => (CHALLENGE_TYPES as readonly string[]).includes(value), "Tür seçiniz"),
    targetValue: z
      .string()
      .min(1, "Hedef değer zorunludur")
      .refine((value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0;
      }, "Pozitif bir değer gir"),
    unit: z.string().min(1, "Birim zorunludur").max(20, "En fazla 20 karakter olmalı"),
    startsAt: z
      .string()
      .min(1, "Başlangıç tarihi zorunludur")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih gir"),
    endsAt: z
      .string()
      .min(1, "Bitiş tarihi zorunludur")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih gir"),
    isPublic: z.boolean(),
  })
  .refine((data) => data.startsAt < data.endsAt, {
    message: "Başlangıç tarihi bitişten önce olmalı",
    path: ["endsAt"],
  });

export type CreateChallengeFormValues = z.infer<typeof createChallengeSchema>;
