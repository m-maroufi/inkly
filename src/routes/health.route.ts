import { Router } from "express";
import { AppError } from "../shared/errors/app-error";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Inkly API is healthy.",
  });
});
