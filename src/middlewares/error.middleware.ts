import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error";
import { logger } from "../config/logger";
import { ZodError } from "zod";
import multer from "multer";
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

  if (err instanceof multer.MulterError) {
    const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "Image must not exceed 5 MB.",
      LIMIT_FILE_COUNT: "Only one image is allowed.",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
      LIMIT_FIELD_COUNT: "Too many form fields.",
      LIMIT_PART_COUNT: "Too many multipart parts.",
      LIMIT_FIELD_VALUE: "A form field exceeds the allowed size.",
    };

    const message = messages[err.code] ?? "Invalid multipart upload.";

    logger.warn(
      {
        statusCode,
        multerCode: err.code,
        method: req.method,
        url: req.originalUrl,
      },
      "Multer upload error",
    );

    res.status(statusCode).json({
      success: false,
      error: {
        statusCode,
        message,
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
