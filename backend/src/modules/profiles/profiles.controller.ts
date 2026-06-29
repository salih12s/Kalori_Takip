import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { profilesService } from "./profiles.service.js";
import { updateProfileSchema } from "./profiles.validation.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.getOrCreateMyProfile(req.user!.id);

  return res.json(successResponse("Profile retrieved successfully", { profile }));
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const input = updateProfileSchema.parse(req.body);
  const profile = await profilesService.updateMyProfile(req.user!.id, input);

  return res.json(successResponse("Profile updated successfully", { profile }));
});
