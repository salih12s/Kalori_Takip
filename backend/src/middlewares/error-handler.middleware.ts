import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../shared/errors/app-error.js";
import { errorResponse } from "../shared/responses/api-response.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message, error.errors));
  }

  if (error instanceof ZodError) {
    return res.status(400).json(errorResponse("Validation error", error.issues));
  }

  console.error(error);

  return res.status(500).json(errorResponse("Internal server error"));
};
