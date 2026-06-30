import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { gamificationService } from "./gamification.service.js";
import { recalculateSchema } from "./gamification.validation.js";

export const getBadges = asyncHandler(async (req, res) => {
  const result = await gamificationService.getBadges(req.user!.id);

  return res.json(successResponse("Badges retrieved successfully", result));
});

export const getMyBadges = asyncHandler(async (req, res) => {
  const result = await gamificationService.getMyBadges(req.user!.id);

  return res.json(successResponse("Earned badges retrieved successfully", result));
});

export const getSummary = asyncHandler(async (req, res) => {
  const result = await gamificationService.getSummary(req.user!.id);

  return res.json(successResponse("Gamification summary retrieved successfully", result));
});

export const recalculate = asyncHandler(async (req, res) => {
  recalculateSchema.parse(req.body ?? {});
  const result = await gamificationService.recalculate(req.user!.id);

  return res.json(successResponse("Gamification recalculated successfully", result));
});
