import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createActivity,
  createWaterLog,
  createWorkout,
  deleteActivity,
  deleteWaterLog,
  deleteWorkout,
  getActivities,
  setOffDay
} from "./activity.controller.js";

export const activityRoutes = Router();

activityRoutes.get("/", authMiddleware, getActivities);
activityRoutes.post("/", authMiddleware, createActivity);
activityRoutes.delete("/:activityId", authMiddleware, deleteActivity);
activityRoutes.post("/off-day", authMiddleware, setOffDay);
activityRoutes.post("/workouts", authMiddleware, createWorkout);
activityRoutes.delete("/workouts/:workoutId", authMiddleware, deleteWorkout);
activityRoutes.post("/water", authMiddleware, createWaterLog);
activityRoutes.delete("/water/:waterLogId", authMiddleware, deleteWaterLog);
