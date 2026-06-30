import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { challengesService } from "./challenges.service.js";
import { challengeIdParamsSchema, createChallengeSchema } from "./challenges.validation.js";

export const listChallenges = asyncHandler(async (req, res) => {
  const result = await challengesService.list(req.user!.id);

  return res.json(successResponse("Challenges retrieved successfully", result));
});

export const listMyChallenges = asyncHandler(async (req, res) => {
  const result = await challengesService.listMine(req.user!.id);

  return res.json(successResponse("My challenges retrieved successfully", result));
});

export const getChallenge = asyncHandler(async (req, res) => {
  const input = challengeIdParamsSchema.parse(req.params);
  const result = await challengesService.getDetail(req.user!.id, input.challengeId);

  return res.json(successResponse("Challenge retrieved successfully", result));
});

export const createChallenge = asyncHandler(async (req, res) => {
  const input = createChallengeSchema.parse(req.body);
  const result = await challengesService.create(req.user!.id, input);

  return res.status(201).json(successResponse("Challenge created successfully", result));
});

export const joinChallenge = asyncHandler(async (req, res) => {
  const input = challengeIdParamsSchema.parse(req.params);
  const result = await challengesService.join(req.user!.id, input.challengeId);

  return res.json(successResponse("Challenge joined successfully", result));
});

export const leaveChallenge = asyncHandler(async (req, res) => {
  const input = challengeIdParamsSchema.parse(req.params);
  const result = await challengesService.leave(req.user!.id, input.challengeId);

  return res.json(successResponse("Challenge left successfully", result));
});

export const recalculateChallenge = asyncHandler(async (req, res) => {
  const input = challengeIdParamsSchema.parse(req.params);
  const result = await challengesService.recalculate(req.user!.id, input.challengeId);

  return res.json(successResponse("Challenge progress recalculated successfully", result));
});

export const recalculateAllChallenges = asyncHandler(async (req, res) => {
  const result = await challengesService.recalculateAll(req.user!.id);

  return res.json(successResponse("Challenge progress recalculated successfully", result));
});
