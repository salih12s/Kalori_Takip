import { api, type ApiResponse } from "../../../lib/api";
import type {
  CreateActivityPayload,
  CreateWaterLogPayload,
  CreateWorkoutPayload,
  DailyActivityResponse,
  SetOffDayPayload,
} from "../types/activity.types";

export const activityApi = {
  async getDaily(date: string): Promise<DailyActivityResponse> {
    const res = await api.get<ApiResponse<DailyActivityResponse>>("/activities", { date });
    return res.data as DailyActivityResponse;
  },
  async addActivity(payload: CreateActivityPayload) {
    const res = await api.post<ApiResponse<DailyActivityResponse>>("/activities", payload);
    return res.data as DailyActivityResponse;
  },
  async deleteActivity(activityId: string) {
    const res = await api.delete<ApiResponse<DailyActivityResponse>>(`/activities/${activityId}`);
    return res.data as DailyActivityResponse;
  },
  async setOffDay(payload: SetOffDayPayload) {
    const res = await api.post<ApiResponse<{ dailyTotals: DailyActivityResponse["dailyTotals"] }>>("/activities/off-day", payload);
    return res.data;
  },
  async addWorkout(payload: CreateWorkoutPayload) {
    const res = await api.post<ApiResponse<DailyActivityResponse>>("/activities/workouts", payload);
    return res.data as DailyActivityResponse;
  },
  async deleteWorkout(workoutId: string) {
    const res = await api.delete<ApiResponse<DailyActivityResponse>>(`/activities/workouts/${workoutId}`);
    return res.data as DailyActivityResponse;
  },
  async addWaterLog(payload: CreateWaterLogPayload) {
    const res = await api.post<ApiResponse<DailyActivityResponse>>("/activities/water", payload);
    return res.data as DailyActivityResponse;
  },
  async deleteWaterLog(waterLogId: string) {
    const res = await api.delete<ApiResponse<DailyActivityResponse>>(`/activities/water/${waterLogId}`);
    return res.data as DailyActivityResponse;
  },
};
