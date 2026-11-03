import { post_views } from "../../db/schema/post_views";

export type PostView = typeof post_views.$inferSelect;
export type NewPostView = typeof post_views.$inferInsert;

export type RecordViewInput = {
  postId: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type RecordViewResult = {
  recorded: boolean;
  totalViews: number;
};
