import type { Gender, GoalType, PrivacyLevel } from "../types/profile.types";

export const genderLabels: Record<Gender, string> = {
  MALE: "Erkek",
  FEMALE: "Kadın",
  OTHER: "Diğer",
  PREFER_NOT_TO_SAY: "Belirtmek istemiyorum",
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

export const genderOptions: Array<{ value: Gender; label: string }> = (
  Object.keys(genderLabels) as Gender[]
).map((value) => ({ value, label: genderLabels[value] }));

export const privacyOptions: Array<{ value: PrivacyLevel; label: string }> = (
  Object.keys(privacyLabels) as PrivacyLevel[]
).map((value) => ({ value, label: privacyLabels[value] }));

export const goalTypeOptions: Array<{ value: GoalType; label: string }> = (
  Object.keys(goalTypeLabels) as GoalType[]
).map((value) => ({ value, label: goalTypeLabels[value] }));
