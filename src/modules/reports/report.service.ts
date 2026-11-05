import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findCommentById } from "../comments/comment.repository";
import { findPostById } from "../posts/post.repository";
import { findUserById } from "../users/user.repository";
import {
  createReport,
  findReportById,
  findReportDetailsById,
  findReports,
  updateReportStatus,
} from "./report.repository";
import {
  CreateReportInput,
  ReportFilterQuery,
  UpdateReportStatusInput,
} from "./report.types";

// ۱. سرویس ثبت گزارش
export async function createReportService(
  reporterId: string,
  data: CreateReportInput,
) {
  // اگر هدف گزارش پست است، وجود پست بررسی شود
  if (data.postId) {
    const post = await findPostById(data.postId);
    if (!post) {
      throw new NotFoundError("Post not found.");
    }
  }

  // اگر هدف گزارش کامنت است، وجود کامنت بررسی شود
  if (data.commentId) {
    const comment = await findCommentById(data.commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found.");
    }
  }

  // اگر هدف گزارش یک کاربر است
  if (data.reportedUserId) {
    // کاربر نمی‌تواند به خودش گزارش دهد
    if (data.reportedUserId === reporterId) {
      throw new ConflictError("You cannot report yourself.");
    }

    const user = await findUserById(data.reportedUserId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
  }

  return await createReport(reporterId, data);
}

// ۲. سرویس دریافت لیست گزارش‌ها برای ادمین
export async function getReportsAdminService(filter?: ReportFilterQuery) {
  return await findReports(filter);
}

// ۳. سرویس دریافت جزئیات یک گزارش برای ادمین
export async function getReportDetailsAdminService(reportId: string) {
  const report = await findReportDetailsById(reportId);
  if (!report) {
    throw new NotFoundError("Report not found.");
  }
  return report;
}

// ۴. سرویس به‌روزرسانی وضعیت گزارش توسط ادمین
export async function updateReportStatusAdminService(
  reportId: string,
  data: UpdateReportStatusInput,
) {
  const existingReport = await findReportById(reportId);
  if (!existingReport) {
    throw new NotFoundError("Report not found.");
  }

  return await updateReportStatus(reportId, data.status);
}
