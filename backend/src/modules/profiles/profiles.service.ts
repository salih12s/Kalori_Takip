import { toProfileResponse } from "./profiles.mapper.js";
import { profilesRepository } from "./profiles.repository.js";
import type { ProfileResponse, UpdateProfileInput } from "./profiles.types.js";

export const profilesService = {
  async getOrCreateMyProfile(userId: string): Promise<ProfileResponse> {
    const existingProfile = await profilesRepository.findByUserId(userId);
    const profile = existingProfile ?? (await profilesRepository.createDefault(userId));

    return toProfileResponse(profile);
  },

  async updateMyProfile(userId: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    const existingProfile = await profilesRepository.findByUserId(userId);

    if (!existingProfile) {
      await profilesRepository.createDefault(userId);
    }

    const profile = await profilesRepository.updateByUserId(userId, input);

    return toProfileResponse(profile);
  }
};
