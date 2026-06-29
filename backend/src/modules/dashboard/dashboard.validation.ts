import { z } from "zod";

import { parseDateOnly } from "../../shared/utils/date.js";

const optionalDateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform(parseDateOnly)
  .optional();

export const todayDashboardQuerySchema = z.object({
  date: optionalDateOnlySchema
});

export const weeklyDashboardQuerySchema = z.object({
  startDate: optionalDateOnlySchema
});
