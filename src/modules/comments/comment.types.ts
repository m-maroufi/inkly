import { z } from "zod";
import { comments } from "../../db/schema/comments";
import { createCommentSchema, updateCommentSchema } from "./comment.schema";

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// ورودی مورد نیاز متد ایجاد کامنت در ریپازیتوری
export type CreateCommentRepositoryInput = {
  userId: string;
  postId: string;
  content: string;
  parentId?: string | null;
};

// اطلاعات نویسنده کامنت برای نمایش عمومی
export type CommentAuthor = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

// کامنت همراه با اطلاعات نویسنده
export type CommentWithAuthor = {
  id: string;
  userId: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: CommentAuthor;
};

// ساختار کامنت به همراه ریپلای‌های تودرتو (Tree structure)
export type CommentWithReplies = CommentWithAuthor & {
  replies: CommentWithReplies[];
};
