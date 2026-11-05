import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/authorization.middleware";
import {
  createReportController,
  getReportDetailsAdminController,
  getReportsAdminController,
  updateReportStatusAdminController,
} from "./report.controller";

export const reportRouter = Router();

// ثبت گزارش توسط کاربر لاگین‌شده
reportRouter.post("/", authMiddleware, createReportController);

// روت‌های مخصوص ادمین
reportRouter.get(
  "/admin",
  authMiddleware,
  requireRole("ADMIN"),
  getReportsAdminController,
);

reportRouter.get(
  "/admin/:reportId",
  authMiddleware,
  requireRole("ADMIN"),
  getReportDetailsAdminController,
);

reportRouter.patch(
  "/admin/:reportId",
  authMiddleware,
  requireRole("ADMIN"),
  updateReportStatusAdminController,
);
