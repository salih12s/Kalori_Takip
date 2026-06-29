import { AppError } from "../../shared/errors/app-error.js";
import { toGoalResponse } from "./goals.mapper.js";
import { goalsRepository } from "./goals.repository.js";
import type { CreateGoalInput, GoalResponse, UpdateGoalInput } from "./goals.types.js";

export const goalsService = {
  async getMyActiveGoal(userId: string): Promise<GoalResponse | null> {
    const goal = await goalsRepository.findActiveByUserId(userId);

    return goal ? toGoalResponse(goal) : null;
  },

  async createGoal(userId: string, input: CreateGoalInput): Promise<GoalResponse> {
    const goal = await goalsRepository.createActiveGoal(userId, input);

    return toGoalResponse(goal);
  },

  async updateGoal(goalId: string, userId: string, input: UpdateGoalInput): Promise<GoalResponse> {
    const existingGoal = await goalsRepository.findById(goalId);

    if (!existingGoal || existingGoal.userId !== userId) {
      throw new AppError("Goal not found", 404);
    }

    const goal = await goalsRepository.updateOwnedGoal(goalId, userId, input);

    return toGoalResponse(goal);
  }
};
