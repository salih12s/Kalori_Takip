import { z } from "zod";

/**
 * Onboarding form values are kept as strings (HTML inputs are strings) and
 * validated against the backend ranges. Conversion to numbers/enums happens
 * when building the API payload, which keeps form typing simple.
 */
const GENDERS = ["MALE", "FEMALE"] as const;
const PRIVACY_LEVELS = ["PUBLIC", "FRIENDS", "PRIVATE"] as const;
const GOAL_TYPES = ["LOSE_WEIGHT", "MAINTAIN_WEIGHT", "GAIN_WEIGHT", "IMPROVE_FITNESS"] as const;
const ACTIVITY_LEVELS = ["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"] as const;

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

const requiredSelect = (allowed: readonly string[], message: string) =>
  z.string().min(1, message).refine((value) => allowed.includes(value), message);

export const profileStepSchema = z.object({
  fullName: z.string().min(1, "Ad soyad zorunludur").max(120, "En fazla 120 karakter olmalı"),
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
  activityLevel: requiredSelect(ACTIVITY_LEVELS, "Aktivite seviyesi seçiniz"),
  privacyLevel: requiredSelect(PRIVACY_LEVELS, "Gizlilik seçiniz"),
});

export type ProfileStepValues = z.infer<typeof profileStepSchema>;

/**
 * The goal step itself no longer collects calorie/protein/carb/fat/water/
 * target-weight numbers directly — those come from the five independent
 * calculator tabs (see components/goal-tabs). Target weight in particular is
 * entered once in the Protein tab and reused everywhere it's needed. This
 * schema only covers the fields with no dedicated calculator: goal
 * classification and step/workout targets.
 */
export const goalStepSchema = z.object({
  goalType: requiredSelect(GOAL_TYPES, "Hedef tipi seçiniz"),
  dailyStepGoal: requiredInt(1000, 50000, "Adım 1000-50000 arasında olmalı"),
  weeklyWorkoutGoal: requiredInt(1, 14, "Haftalık spor 1-14 arasında olmalı"),
});

export type GoalStepValues = z.infer<typeof goalStepSchema>;
