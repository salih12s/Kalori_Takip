import { z } from "zod";

export const userSearchSchema = z.object({
  q: z.string().trim().min(1).max(80)
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid()
});

export const followIdParamsSchema = z.object({
  followId: z.string().uuid()
});
