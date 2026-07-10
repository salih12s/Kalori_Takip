import type { ActivityLevel, Gender, PrivacyLevel } from "@prisma/client";
import type { z } from "zod";

import type { updateProfileSchema } from "./profiles.validation.js";

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type ProfileResponse = {
  id: string;
  userId: string;
  fullName: string | null;
  bio: string | null;
  gender: Gender | null;
  avatarUrl: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  birthDate: Date | null;
  goalType: string | null;
  activityLevel: ActivityLevel | null;
  privacyLevel: PrivacyLevel;
  createdAt: Date;
  updatedAt: Date;
};
