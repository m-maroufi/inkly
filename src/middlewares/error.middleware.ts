import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error";
import { logger } from "../config/logger";
import { ZodError } from "zod";
export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    logger.warn(
      {
        method: req.method,
        url: req.originalUrl,
      },
      "Validation error",
    );

    res.status(400).json({
      success: false,
      error: {
        statusCode: 400,
        message: "Validation failed",
        details: err.issues,
      },
    });

    return;
  }

  if (err instanceof AppError) {
    logger.warn(
      {
        statusCode: err.statusCode,
        method: req.method,
        url: req.originalUrl,
      },
      err.message,
    );

    res.status(err.statusCode).json({
      success: false,
      error: {
        statusCode: err.statusCode,
        message: err.message,
      },
    });
    return;
  }

  logger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled error",
  );
  res.status(500).json({
    success: false,
    error: {
      statusCode: 500,
      message: "Internal server error",
    },
  });
}
