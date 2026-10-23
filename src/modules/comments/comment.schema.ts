import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment must be at most 2000 characters."),
  parentId: z.uuid("Invalid parent comment ID.").nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment must be at most 2000 characters."),
});

export const postIdParamSchema = z.object({
  postId: z.uuid("Invalid post ID."),
});

export const commentIdParamSchema = z.object({
  commentId: z.uuid("Invalid comment ID."),
});
