import { z } from "zod";

const optionalInt = (message: string) =>
  z.string().optional().refine((value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0), message);

const optionalNumber = (message: string) =>
  z.string().optional().refine((value) => !value || (Number.isFinite(Number(value)) && Number(value) >= 0), message);

export const activityEntrySchema = z.object({
  activityType: z.enum(["RUN", "WALK", "STEPS", "WORKOUT"]),
  steps: optionalInt("Adım 0 veya daha büyük olmalıdır"),
  distanceKm: optionalNumber("Mesafe 0 veya daha büyük olmalıdır"),
  durationMinutes: optionalInt("Süre 0 veya daha büyük olmalıdır"),
  caloriesBurned: optionalInt("Yakılan kalori 0 veya daha büyük olmalıdır"),
  note: z.string().max(500, "Not çok uzun").optional(),
});

export type ActivityEntryFormValues = z.infer<typeof activityEntrySchema>;

export const workoutSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunludur").max(160, "Başlık çok uzun"),
  workoutType: z.enum(["WEIGHT_TRAINING", "CARDIO", "MOBILITY", "SPORT", "OTHER"]),
  muscleGroups: z.string().max(500, "Kas grupları çok uzun").optional(),
  durationMinutes: z.string().min(1, "Süre zorunludur").refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "Süre 0'dan büyük olmalıdır"),
  caloriesBurned: optionalInt("Yakılan kalori 0 veya daha büyük olmalıdır"),
  intensity: z.string().optional().refine((value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 10), "Yoğunluk 1-10 arasında olmalıdır"),
  note: z.string().max(500, "Not çok uzun").optional(),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

export const waterLogSchema = z.object({
  amountMl: z.string().min(1, "Su miktarı zorunludur").refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "Su miktarı 0'dan büyük olmalıdır"),
});

export type WaterLogFormValues = z.infer<typeof waterLogSchema>;

export const offDaySchema = z.object({
  isOffDay: z.boolean(),
  note: z.string().max(500, "Not çok uzun").optional(),
});

export type OffDayFormValues = z.infer<typeof offDaySchema>;
