import { AppError } from "../../shared/errors/app-error.js";
import {
  toActivityEntry,
  toActivityTotals,
  toWaterLog,
  toWorkout
} from "./activity.mapper.js";
import { activityRepository } from "./activity.repository.js";
import type { CreateActivityInput, CreateWaterLogInput, CreateWorkoutInput, SetOffDayInput } from "./activity.types.js";

export const activityService = {
  async getDay(userId: string, date: Date) {
    const result = await activityRepository.getDay(userId, date);

    return {
      dailyTotals: toActivityTotals(result.dailyLog),
      activities: result.activities.map(toActivityEntry),
      workouts: result.workouts.map(toWorkout),
      waterLogs: result.waterLogs.map(toWaterLog)
    };
  },

  async createActivity(userId: string, input: CreateActivityInput) {
    const result = await activityRepository.createActivity(userId, input);

    return {
      activity: toActivityEntry(result.activity),
      dailyTotals: toActivityTotals(result.dailyLog)
    };
  },

  async deleteActivity(userId: string, activityId: string) {
    const result = await activityRepository.deleteActivity(userId, activityId);

    if (!result) {
      throw new AppError("Activity not found", 404);
    }

    return { dailyTotals: toActivityTotals(result.dailyLog) };
  },

  async setOffDay(userId: string, input: SetOffDayInput) {
    const dailyLog = await activityRepository.setOffDay(userId, input);

    return { dailyTotals: toActivityTotals(dailyLog) };
  },

  async createWorkout(userId: string, input: CreateWorkoutInput) {
    const result = await activityRepository.createWorkout(userId, input);

    return {
      workout: toWorkout(result.workout),
      dailyTotals: toActivityTotals(result.dailyLog)
    };
  },

  async deleteWorkout(userId: string, workoutId: string) {
    const result = await activityRepository.deleteWorkout(userId, workoutId);

    if (!result) {
      throw new AppError("Workout not found", 404);
    }

    return { dailyTotals: toActivityTotals(result.dailyLog) };
  },

  async createWaterLog(userId: string, input: CreateWaterLogInput) {
    const result = await activityRepository.createWaterLog(userId, input);

    return {
      waterLog: toWaterLog(result.waterLog),
      dailyTotals: toActivityTotals(result.dailyLog)
    };
  },

  async deleteWaterLog(userId: string, waterLogId: string) {
    const result = await activityRepository.deleteWaterLog(userId, waterLogId);

    if (!result) {
      throw new AppError("Water log not found", 404);
    }

    return { dailyTotals: toActivityTotals(result.dailyLog) };
  }
};
