import type { RequestHandler } from "express";

import { successResponse } from "../../shared/responses/api-response.js";

export const getHealth: RequestHandler = (_req, res) => {
  return res.json(successResponse("FitBoard API is running"));
};
