import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { nutritionService } from "./nutrition.service.js";
import {
  createFoodSchema,
  createMealEntrySchema,
  deleteMealEntryParamsSchema,
  foodSearchSchema,
  getMealsSchema,
  importExternalFoodSchema
} from "./nutrition.validation.js";

export const searchFoods = asyncHandler(async (req, res) => {
  const input = foodSearchSchema.parse(req.query);
  const result = await nutritionService.searchFoods(input);

  return res.json(successResponse("Foods retrieved successfully", result));
});

export const createFood = asyncHandler(async (req, res) => {
  const input = createFoodSchema.parse(req.body);
  const food = await nutritionService.createFood(req.user!.id, input);

  return res.status(201).json(successResponse("Food created successfully", { food }));
});

export const importExternalFood = asyncHandler(async (req, res) => {
  const input = importExternalFoodSchema.parse(req.body);
  const food = await nutritionService.importExternalFood(req.user!.id, input);

  return res.status(201).json(successResponse("External food imported successfully", { food }));
});

export const getMeals = asyncHandler(async (req, res) => {
  const input = getMealsSchema.parse(req.query);
  const result = await nutritionService.getMeals(req.user!.id, input.date);

  return res.json(successResponse("Meals retrieved successfully", result));
});

export const createMealEntry = asyncHandler(async (req, res) => {
  const input = createMealEntrySchema.parse(req.body);
  const result = await nutritionService.createMealEntry(req.user!.id, input);

  return res.status(201).json(successResponse("Food entry created successfully", result));
});

export const deleteMealEntry = asyncHandler(async (req, res) => {
  const input = deleteMealEntryParamsSchema.parse(req.params);
  const result = await nutritionService.deleteMealEntry(req.user!.id, input.entryId);

  return res.json(successResponse("Food entry deleted successfully", result));
});
