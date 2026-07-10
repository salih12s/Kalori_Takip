import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { measurementSchema } from "./measurements.validation.js";
import { measurementsService } from "./measurements.service.js";

export const getMeasurements = asyncHandler(async (req, res) => {
  const measurements = await measurementsService.list(req.user!.id);
  return res.json(successResponse("Measurements retrieved successfully", { measurements }));
});

export const upsertMeasurement = asyncHandler(async (req, res) => {
  const input = measurementSchema.parse(req.body);
  const measurement = await measurementsService.upsert(req.user!.id, input);
  return res.json(successResponse("Measurement saved successfully", { measurement }));
});
