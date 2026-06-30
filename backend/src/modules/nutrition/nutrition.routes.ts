import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createFood,
  createMealEntry,
  deleteMealEntry,
  getMeals,
  importExternalFood,
  searchFoods
} from "./nutrition.controller.js";

export const nutritionRoutes = Router();

nutritionRoutes.get("/foods/search", authMiddleware, searchFoods);
nutritionRoutes.post("/foods", authMiddleware, createFood);
nutritionRoutes.post("/foods/import-external", authMiddleware, importExternalFood);
nutritionRoutes.get("/meals", authMiddleware, getMeals);
nutritionRoutes.post("/meals/entries", authMiddleware, createMealEntry);
nutritionRoutes.delete("/meals/entries/:entryId", authMiddleware, deleteMealEntry);
