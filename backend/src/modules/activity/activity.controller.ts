import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { activityService } from "./activity.service.js";
import {
  activityIdParamsSchema,
  createActivitySchema,
  createWaterLogSchema,
  createWorkoutSchema,
  getActivitiesSchema,
  setOffDaySchema,
  waterLogIdParamsSchema,
  workoutIdParamsSchema
} from "./activity.validation.js";

export const getActivities = asyncHandler(async (req, res) => {
  const input = getActivitiesSchema.parse(req.query);
  const result = await activityService.getDay(req.user!.id, input.date);

  return res.json(successResponse("Activities retrieved successfully", result));
});

export const createActivity = asyncHandler(async (req, res) => {
  const input = createActivitySchema.parse(req.body);
  const result = await activityService.createActivity(req.user!.id, input);

  return res.status(201).json(successResponse("Activity created successfully", result));
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const input = activityIdParamsSchema.parse(req.params);
  const result = await activityService.deleteActivity(req.user!.id, input.activityId);

  return res.json(successResponse("Activity deleted successfully", result));
});

export const setOffDay = asyncHandler(async (req, res) => {
  const input = setOffDaySchema.parse(req.body);
  const result = await activityService.setOffDay(req.user!.id, input);

  return res.json(successResponse("Off day updated successfully", result));
});

export const createWorkout = asyncHandler(async (req, res) => {
  const input = createWorkoutSchema.parse(req.body);
  const result = await activityService.createWorkout(req.user!.id, input);

  return res.status(201).json(successResponse("Workout created successfully", result));
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  const input = workoutIdParamsSchema.parse(req.params);
  const result = await activityService.deleteWorkout(req.user!.id, input.workoutId);

  return res.json(successResponse("Workout deleted successfully", result));
});

export const createWaterLog = asyncHandler(async (req, res) => {
  const input = createWaterLogSchema.parse(req.body);
  const result = await activityService.createWaterLog(req.user!.id, input);

  return res.status(201).json(successResponse("Water log created successfully", result));
});

export const deleteWaterLog = asyncHandler(async (req, res) => {
  const input = waterLogIdParamsSchema.parse(req.params);
  const result = await activityService.deleteWaterLog(req.user!.id, input.waterLogId);

  return res.json(successResponse("Water log deleted successfully", result));
});
