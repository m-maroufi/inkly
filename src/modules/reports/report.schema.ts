import { z } from "zod";
import { reasonType, reportStatusType } from "../../db/schema/reports";

export const createReportSchema = z
  .object({
    postId: z.uuid("Invalid post ID.").optional(),
    commentId: z.uuid("Invalid comment ID.").optional(),
    reportedUserId: z.uuid("Invalid user ID.").optional(),
    reason: z.enum(reasonType.enumValues),
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters.")
      .optional(),
  })
  .refine(
    (data) => {
      const targets = [data.postId, data.commentId, data.reportedUserId].filter(
        Boolean,
      );
      return targets.length === 1;
    },
    {
      message:
        "Exactly one target (postId, commentId, or reportedUserId) must be provided.",
      path: ["postId"],
    },
  );

export const updateReportStatusSchema = z.object({
  status: z.enum(reportStatusType.enumValues),
});

export const reportIdParamSchema = z.object({
  reportId: z.uuid("Invalid report ID."),
});

export const reportFilterQuerySchema = z.object({
  status: z.enum(reportStatusType.enumValues).optional(),
});
