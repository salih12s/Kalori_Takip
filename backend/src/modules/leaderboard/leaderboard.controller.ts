import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { leaderboardService } from "./leaderboard.service.js";
import {
  friendsLeaderboardQuerySchema,
  monthlyLeaderboardQuerySchema,
  recalculateRangeSchema,
  recalculateSchema,
  weeklyLeaderboardQuerySchema
} from "./leaderboard.validation.js";

export const recalculateLeaderboard = asyncHandler(async (req, res) => {
  const input = recalculateSchema.parse(req.body);
  const result = await leaderboardService.recalculate(req.user!.id, input.date);

  return res.json(successResponse("Leaderboard score recalculated successfully", result));
});

export const recalculateLeaderboardRange = asyncHandler(async (req, res) => {
  const input = recalculateRangeSchema.parse(req.body);
  const result = await leaderboardService.recalculateRange(req.user!.id, input);

  return res.json(successResponse("Leaderboard score range recalculated successfully", result));
});

export const getWeeklyLeaderboard = asyncHandler(async (req, res) => {
  const input = weeklyLeaderboardQuerySchema.parse(req.query);
  const result = await leaderboardService.getWeekly(req.user!.id, input.startDate);

  return res.json(successResponse("Weekly leaderboard retrieved successfully", result));
});

export const getMonthlyLeaderboard = asyncHandler(async (req, res) => {
  const input = monthlyLeaderboardQuerySchema.parse(req.query);
  const result = await leaderboardService.getMonthly(req.user!.id, input.month);

  return res.json(successResponse("Monthly leaderboard retrieved successfully", result));
});

export const getFriendsLeaderboard = asyncHandler(async (req, res) => {
  const input = friendsLeaderboardQuerySchema.parse(req.query);
  const result = await leaderboardService.getFriends(req.user!.id, input.period);

  return res.json(successResponse("Friends leaderboard retrieved successfully", result));
});

export const getMyLeaderboardSummary = asyncHandler(async (req, res) => {
  const result = await leaderboardService.getMySummary(req.user!.id);

  return res.json(successResponse("Leaderboard summary retrieved successfully", result));
});
