import { alias } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema/users";
import { posts } from "../../db/schema/posts";
import { comments } from "../../db/schema/comments";
import { reports } from "../../db/schema/reports";
import { handleDatabaseError } from "../../shared/errors/database-error";
import {
  CreateReportInput,
  ReasonType,
  ReportFilterQuery,
  ReportItem,
  ReportStatusType,
} from "./report.types";

const reporters = alias(users, "reporters");
const reportedUsers = alias(users, "reported_users");

// فیلدهای انتخابی برای گزارش به همراه اطلاعات کامل جوین‌ها
const reportSelectFields = {
  id: reports.id,
  reason: reports.reason,
  description: reports.description,
  status: reports.status,
  // اطلاعات گزارش‌دهنده
  reporterId: reporters.id,
  reporterUsername: reporters.username,
  reporterDisplayName: reporters.display_name,
  reporterAvatarUrl: reporters.avatar_url,
  // اطلاعات پست (اگر هدف پست باشد)
  postId: posts.id,
  postTitle: posts.title,
  postSlug: posts.slug,
  // اطلاعات کامنت (اگر هدف کامنت باشد)
  commentId: comments.id,
  commentContent: comments.content,
  // اطلاعات کاربر گزارش‌شده (اگر هدف کاربر باشد)
  reportedUserId: reportedUsers.id,
  reportedUserUsername: reportedUsers.username,
  reportedUserDisplayName: reportedUsers.display_name,
  reportedUserAvatarUrl: reportedUsers.avatar_url,
};

// تابع کمکی برای تبدیل سطرهای دیتابیس به ساختار تمیز ReportItem
function mapReportItem(raw: {
  id: string;
  reason: ReasonType;
  description: string | null;
  status: ReportStatusType;
  reporterId: string | null;
  reporterUsername: string | null;
  reporterDisplayName: string | null;
  reporterAvatarUrl: string | null;
  postId: string | null;
  postTitle: string | null;
  postSlug: string | null;
  commentId: string | null;
  commentContent: string | null;
  reportedUserId: string | null;
  reportedUserUsername: string | null;
  reportedUserDisplayName: string | null;
  reportedUserAvatarUrl: string | null;
}): ReportItem {
  return {
    id: raw.id,
    reason: raw.reason,
    description: raw.description,
    status: raw.status,
    reporter: raw.reporterId
      ? {
          id: raw.reporterId,
          username: raw.reporterUsername ?? "",
          displayName: raw.reporterDisplayName ?? "",
          avatarUrl: raw.reporterAvatarUrl,
        }
      : null,
    post: raw.postId
      ? {
          id: raw.postId,
          title: raw.postTitle ?? "",
          slug: raw.postSlug ?? "",
        }
      : null,
    comment: raw.commentId
      ? {
          id: raw.commentId,
          content: raw.commentContent ?? "",
        }
      : null,
    reportedUser: raw.reportedUserId
      ? {
          id: raw.reportedUserId,
          username: raw.reportedUserUsername ?? "",
          displayName: raw.reportedUserDisplayName ?? "",
          avatarUrl: raw.reportedUserAvatarUrl,
        }
      : null,
  };
}

// ۱. ثبت گزارش جدید
export async function createReport(
  reporterId: string,
  data: CreateReportInput,
) {
  try {
    const [report] = await db
      .insert(reports)
      .values({
        status: "PENDING",
        description: data.description,
        reported_user_id: data.reportedUserId ?? null,
        post_id: data.postId ?? null,
        comment_id: data.commentId ?? null,
        reason: data.reason,
        reporter_id: reporterId,
      })
      .returning();
    return report;
  } catch (error) {
    handleDatabaseError(error);
  }
}

// ۲. یافتن گزارش ساده بر اساس آیدی (بدون جوین، برای چک کردن وجود داشتن)
export async function findReportById(id: string) {
  const [report] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);
  return report;
}

// ۳. دریافت لیست تمام گزارش‌ها برای ادمین (با فیلتر احتمالی وضعیت)
export async function findReports(
  filter?: ReportFilterQuery,
): Promise<ReportItem[]> {
  const whereClause = filter?.status
    ? eq(reports.status, filter.status)
    : undefined;

  const rawReports = await db
    .select(reportSelectFields)
    .from(reports)
    .leftJoin(reporters, eq(reports.reporter_id, reporters.id))
    .leftJoin(posts, eq(reports.post_id, posts.id))
    .leftJoin(comments, eq(reports.comment_id, comments.id))
    .leftJoin(reportedUsers, eq(reports.reported_user_id, reportedUsers.id))
    .where(whereClause);

  return rawReports.map(mapReportItem);
}

// ۴. دریافت جزئیات کامل یک گزارش خاص برای ادمین
export async function findReportDetailsById(
  reportId: string,
): Promise<ReportItem | undefined> {
  const [report] = await db
    .select(reportSelectFields)
    .from(reports)
    .leftJoin(reporters, eq(reports.reporter_id, reporters.id))
    .leftJoin(posts, eq(reports.post_id, posts.id))
    .leftJoin(comments, eq(reports.comment_id, comments.id))
    .leftJoin(reportedUsers, eq(reports.reported_user_id, reportedUsers.id))
    .where(eq(reports.id, reportId))
    .limit(1);

  if (!report) return undefined;

  return mapReportItem(report);
}

// ۵. به‌روزرسانی وضعیت گزارش توسط ادمین
export async function updateReportStatus(
  reportId: string,
  status: ReportStatusType,
) {
  const [updatedReport] = await db
    .update(reports)
    .set({
      status: status,
    })
    .where(eq(reports.id, reportId))
    .returning();
  return updatedReport;
}
