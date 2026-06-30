import { z } from "zod";

import { parseDateOnly } from "../../shared/utils/date.js";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform(parseDateOnly);

export const recalculateSchema = z
  .object({
    date: dateOnlySchema.optional()
  })
  .strict();

export const recalculateRangeSchema = z
  .object({
    startDate: dateOnlySchema,
    endDate: dateOnlySchema
  })
  .strict();

export const weeklyLeaderboardQuerySchema = z.object({
  startDate: dateOnlySchema.optional()
});

export const monthlyLeaderboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional()
});

export const friendsLeaderboardQuerySchema = z.object({
  period: z.enum(["weekly", "monthly"]).default("weekly")
});
