import z from "zod";
import {
  createPostSchema,
  rejectPostSchema,
  updatePostSchema,
} from "./post.schema";
import { posts } from "../../db/schema/posts";

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type RejectPostInput = z.infer<typeof rejectPostSchema>;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
