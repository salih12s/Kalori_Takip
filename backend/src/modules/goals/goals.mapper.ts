import type { UserGoal } from "@prisma/client";

import type { GoalResponse } from "./goals.types.js";

export function toGoalResponse(goal: UserGoal): GoalResponse {
  return {
    id: goal.id,
    userId: goal.userId,
    goalType: goal.goalType,
    dailyCalorieGoal: goal.dailyCalorieGoal,
    dailyProteinGoal: goal.dailyProteinGoal,
    dailyCarbGoal: goal.dailyCarbGoal,
    dailyFatGoal: goal.dailyFatGoal,
    dailyStepGoal: goal.dailyStepGoal,
    weeklyWorkoutGoal: goal.weeklyWorkoutGoal,
    dailyWaterGoal: goal.dailyWaterGoal,
    startingWeightKg: goal.startingWeightKg ? Number(goal.startingWeightKg) : null,
    targetWeightKg: goal.targetWeightKg ? Number(goal.targetWeightKg) : null,
    startsAt: goal.startsAt,
    endsAt: goal.endsAt,
    isActive: goal.isActive,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt
  };
}
