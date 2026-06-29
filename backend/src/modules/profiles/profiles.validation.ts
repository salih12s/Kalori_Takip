import { Gender, PrivacyLevel } from "@prisma/client";
import { z } from "zod";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().min(1).max(120).optional(),
    bio: z.string().trim().max(500).optional(),
    gender: z.nativeEnum(Gender).optional(),
    birthDate: dateOnlySchema.optional(),
    heightCm: z.number().int().min(80).max(250).optional(),
    currentWeightKg: z.number().positive().min(20).max(400).optional(),
    privacyLevel: z.nativeEnum(PrivacyLevel).optional()
  })
  .strict();
