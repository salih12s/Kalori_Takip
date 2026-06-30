import { z } from "zod";

/**
 * Onboarding form values are kept as strings (HTML inputs are strings) and
 * validated against the backend ranges. Conversion to numbers/enums happens
 * when building the API payload, which keeps form typing simple.
 */
const GENDERS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;
const PRIVACY_LEVELS = ["PUBLIC", "FRIENDS", "PRIVATE"] as const;
const GOAL_TYPES = ["LOSE_WEIGHT", "MAINTAIN_WEIGHT", "GAIN_WEIGHT", "IMPROVE_FITNESS"] as const;

const isIntInRange = (value: string, min: number, max: number): boolean => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

const isNumberInRange = (value: string, min: number, max: number): boolean => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max;
};

const requiredInt = (min: number, max: number, message: string) =>
  z.string().min(1, message).refine((value) => isIntInRange(value, min, max), message);

const optionalInt = (min: number, max: number, message: string) =>
  z.string().optional().refine((value) => !value || isIntInRange(value, min, max), message);

const requiredSelect = (allowed: readonly string[], message: string) =>
  z.string().min(1, message).refine((value) => allowed.includes(value), message);

export const profileStepSchema = z.object({
  fullName: z.string().min(1, "Ad soyad zorunludur").max(120, "En fazla 120 karakter olmalı"),
  bio: z.string().max(500, "En fazla 500 karakter olmalı").optional(),
  gender: requiredSelect(GENDERS, "Cinsiyet seçiniz"),
  birthDate: z
    .string()
    .min(1, "Doğum tarihi zorunludur")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih gir"),
  heightCm: requiredInt(80, 250, "Boy 80-250 cm arasında olmalı"),
  currentWeightKg: z
    .string()
    .min(1, "Kilo zorunludur")
    .refine((value) => isNumberInRange(value, 20, 400), "Kilo 20-400 kg arasında olmalı"),
  privacyLevel: requiredSelect(PRIVACY_LEVELS, "Gizlilik seçiniz"),
});

export type ProfileStepValues = z.infer<typeof profileStepSchema>;

export const goalStepSchema = z.object({
  goalType: requiredSelect(GOAL_TYPES, "Hedef tipi seçiniz"),
  dailyCalorieGoal: requiredInt(1000, 6000, "Kalori 1000-6000 arasında olmalı"),
  dailyProteinGoal: requiredInt(20, 400, "Protein 20-400 g arasında olmalı"),
  dailyCarbGoal: optionalInt(20, 800, "Karbonhidrat 20-800 g arasında olmalı"),
  dailyFatGoal: optionalInt(10, 300, "Yağ 10-300 g arasında olmalı"),
  dailyStepGoal: requiredInt(1000, 50000, "Adım 1000-50000 arasında olmalı"),
  weeklyWorkoutGoal: requiredInt(1, 14, "Haftalık spor 1-14 arasında olmalı"),
  targetWeightKg: z
    .string()
    .optional()
    .refine((value) => !value || isNumberInRange(value, 20, 400), "Hedef kilo 20-400 kg arasında olmalı"),
});

export type GoalStepValues = z.infer<typeof goalStepSchema>;
