import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getMeasurements, upsertMeasurement } from "./measurements.controller.js";

export const measurementsRoutes = Router();
measurementsRoutes.use(authMiddleware);
measurementsRoutes.get("/", getMeasurements);
measurementsRoutes.post("/", upsertMeasurement);
