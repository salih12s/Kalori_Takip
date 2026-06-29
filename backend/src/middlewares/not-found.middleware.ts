import type { RequestHandler } from "express";

import { errorResponse } from "../shared/responses/api-response.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  return res.status(404).json(errorResponse("Route not found"));
};
