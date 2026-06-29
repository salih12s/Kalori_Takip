import type { Profile } from "@prisma/client";

import type { ProfileResponse } from "./profiles.types.js";

export function toProfileResponse(profile: Profile): ProfileResponse {
  return {
    id: profile.id,
    userId: profile.userId,
    fullName: profile.fullName,
    bio: profile.bio,
    gender: profile.gender,
    avatarUrl: profile.avatarUrl,
    heightCm: profile.heightCm,
    currentWeightKg: profile.currentWeightKg ? Number(profile.currentWeightKg) : null,
    birthDate: profile.birthDate,
    goalType: profile.goalType,
    privacyLevel: profile.privacyLevel,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  };
}
