import type { ActivityLevel, Gender, GoalType, PrivacyLevel } from "../types/profile.types";

export const genderLabels: Record<Gender, string> = {
  MALE: "Erkek",
  FEMALE: "Kadın",
};

export const privacyLabels: Record<PrivacyLevel, string> = {
  PUBLIC: "Herkese Açık",
  FRIENDS: "Arkadaşlar",
  PRIVATE: "Gizli",
};

export const goalTypeLabels: Record<GoalType, string> = {
  LOSE_WEIGHT: "Kilo Vermek",
  MAINTAIN_WEIGHT: "Kiloyu Korumak",
  GAIN_WEIGHT: "Kilo Almak",
  IMPROVE_FITNESS: "Formu Geliştirmek",
};

export const activityLevelLabels: Record<ActivityLevel, string> = {
  SEDENTARY: "Hareketsiz (masa başı iş, egzersiz yok)",
  LIGHT: "Az Hareketli (haftada 1-3 gün hafif egzersiz)",
  MODERATE: "Orta Hareketli (haftada 3-5 gün egzersiz)",
  ACTIVE: "Aktif (haftada 6-7 gün egzersiz)",
  VERY_ACTIVE: "Çok Aktif (günde 2x egzersiz veya fiziksel iş)",
};

export const genderOptions: Array<{ value: Gender; label: string }> = (
  Object.keys(genderLabels) as Gender[]
).map((value) => ({ value, label: genderLabels[value] }));

export const privacyOptions: Array<{ value: PrivacyLevel; label: string }> = (
  Object.keys(privacyLabels) as PrivacyLevel[]
).map((value) => ({ value, label: privacyLabels[value] }));

export const goalTypeOptions: Array<{ value: GoalType; label: string }> = (
  Object.keys(goalTypeLabels) as GoalType[]
).map((value) => ({ value, label: goalTypeLabels[value] }));

export const activityLevelOptions: Array<{ value: ActivityLevel; label: string }> = (
  Object.keys(activityLevelLabels) as ActivityLevel[]
).map((value) => ({ value, label: activityLevelLabels[value] }));
