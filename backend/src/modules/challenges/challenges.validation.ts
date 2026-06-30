import { ChallengeType } from "@prisma/client";
import { z } from "zod";

import { parseDateOnly } from "../../shared/utils/date.js";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform(parseDateOnly);

export const createChallengeSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500).optional(),
    type: z.nativeEnum(ChallengeType),
    targetValue: z.number().positive().max(100_000_000),
    unit: z.string().trim().min(1).max(20),
    startsAt: dateOnlySchema,
    endsAt: dateOnlySchema,
    isPublic: z.boolean().optional().default(true)
  })
  .strict()
  .refine((data) => data.startsAt.getTime() < data.endsAt.getTime(), {
    message: "startsAt must be before endsAt",
    path: ["endsAt"]
  });

export const challengeIdParamsSchema = z.object({
  challengeId: z.string().uuid()
});
