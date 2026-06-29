import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { dashboardService } from "./dashboard.service.js";
import { todayDashboardQuerySchema, weeklyDashboardQuerySchema } from "./dashboard.validation.js";

export const getTodayDashboard = asyncHandler(async (req, res) => {
  const input = todayDashboardQuerySchema.parse(req.query);
  const dashboard = await dashboardService.getTodayDashboard(req.user!.id, input.date);

  return res.json(successResponse("Today dashboard retrieved successfully", dashboard));
});

export const getWeeklyDashboard = asyncHandler(async (req, res) => {
  const input = weeklyDashboardQuerySchema.parse(req.query);
  const dashboard = await dashboardService.getWeeklyDashboard(req.user!.id, input.startDate);

  return res.json(successResponse("Weekly dashboard retrieved successfully", dashboard));
});
