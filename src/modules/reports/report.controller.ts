import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  createReportSchema,
  reportFilterQuerySchema,
  reportIdParamSchema,
  updateReportStatusSchema,
} from "./report.schema";
import {
  createReportService,
  getReportDetailsAdminService,
  getReportsAdminService,
  updateReportStatusAdminService,
} from "./report.service";

// ۱. ثبت گزارش توسط کاربر لاگین‌شده
export async function createReportController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const reporterId = req.user.id;
    const data = createReportSchema.parse(req.body);

    const report = await createReportService(reporterId, data);

    res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

// ۲. دریافت لیست گزارش‌ها برای ادمین (همراه با فیلتر احتمالی وضعیت)
export async function getReportsAdminController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filter = reportFilterQuerySchema.parse(req.query);
    const reports = await getReportsAdminService(filter);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}

// ۳. دریافت جزئیات یک گزارش برای ادمین
export async function getReportDetailsAdminController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { reportId } = reportIdParamSchema.parse(req.params);
    const report = await getReportDetailsAdminService(reportId);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

// ۴. تغییر وضعیت گزارش توسط ادمین
export async function updateReportStatusAdminController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { reportId } = reportIdParamSchema.parse(req.params);
    const data = updateReportStatusSchema.parse(req.body);

    const updatedReport = await updateReportStatusAdminService(reportId, data);

    res.status(200).json({
      success: true,
      message: "Report status updated successfully.",
      data: updatedReport,
    });
  } catch (error) {
    next(error);
  }
}
