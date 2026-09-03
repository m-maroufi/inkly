import { Request, Response } from "express";

export function notFoundMiddlware(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      statusCode: 404,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
}
