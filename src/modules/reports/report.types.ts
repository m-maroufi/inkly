import { z } from "zod";
import { reasonType, reports, reportStatusType } from "../../db/schema/reports";
import {
  createReportSchema,
  reportFilterQuerySchema,
  updateReportStatusSchema,
} from "./report.schema";

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type ReasonType = (typeof reasonType.enumValues)[number];
export type ReportStatusType = (typeof reportStatusType.enumValues)[number];

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
export type ReportFilterQuery = z.infer<typeof reportFilterQuerySchema>;

// اطلاعات کامل گزارش به همراه مشخصات گزارش‌دهنده و هدف برای پنل ادمین
export type ReportItem = {
  id: string;
  reason: ReasonType;
  description: string | null;
  status: ReportStatusType;
  reporter: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  post: {
    id: string;
    title: string;
    slug: string;
  } | null;
  comment: {
    id: string;
    content: string;
  } | null;
  reportedUser: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
};
