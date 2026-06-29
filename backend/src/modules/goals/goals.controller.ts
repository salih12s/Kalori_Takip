import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { goalsService } from "./goals.service.js";
import { createGoalSchema, updateGoalSchema } from "./goals.validation.js";

export const getMyGoal = asyncHandler(async (req, res) => {
  const goal = await goalsService.getMyActiveGoal(req.user!.id);

  return res.json(successResponse("Active goal retrieved successfully", { goal }));
});

export const createGoal = asyncHandler(async (req, res) => {
  const input = createGoalSchema.parse(req.body);
  const goal = await goalsService.createGoal(req.user!.id, input);

  return res.status(201).json(successResponse("Goal created successfully", { goal }));
});

export const updateGoal = asyncHandler(async (req, res) => {
  const input = updateGoalSchema.parse(req.body);
  const goal = await goalsService.updateGoal(req.params.goalId, req.user!.id, input);

  return res.json(successResponse("Goal updated successfully", { goal }));
});
