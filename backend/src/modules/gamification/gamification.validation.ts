import { z } from "zod";

/** Recalculate takes no input; the empty strict body keeps the contract explicit. */
export const recalculateSchema = z.object({}).strict();
