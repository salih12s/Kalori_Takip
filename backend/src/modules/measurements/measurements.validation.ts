import { z } from "zod";

export const measurementSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weightKg: z.number().positive().max(500).nullable().optional(),
  neckCm: z.number().positive().max(300).nullable().optional(),
  waistCm: z.number().positive().max(300).nullable().optional(),
  shoulderCm: z.number().positive().max(300).nullable().optional(),
  hipCm: z.number().positive().max(300).nullable().optional()
}).refine((value) => Object.values(value).some((item) => typeof item === "number"), "En az bir ölçüm girilmeli.");

export type MeasurementInput = z.infer<typeof measurementSchema>;
