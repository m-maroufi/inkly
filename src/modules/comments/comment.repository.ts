import { asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { comments } from "../../db/schema/comments";
import { users } from "../../db/schema/users";
import {
  CommentWithAuthor,
  CreateCommentRepositoryInput,
} from "./comment.types";
import { handleDatabaseError } from "../../shared/errors/database-error";

export async function findCommentsByPostId(
  postId: string,
): Promise<CommentWithAuthor[]> {
  const result = await db
    .select({
      id: comments.id,
      userId: comments.user_id,
      postId: comments.post_id,
      parentId: comments.parent_id,
      content: comments.content,
      createdAt: comments.created_at,
      updatedAt: comments.updated_at,
      author: {
        id: users.id,
        username: users.username,
        displayName: users.display_name,
        avatarUrl: users.avatar_url,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.id))
    .where(eq(comments.post_id, postId))
    .orderBy(asc(comments.created_at));
  return result;
}

export async function findCommentById(commentId: string) {
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);
  return comment;
}

export async function findCommentWithAuthorById(
  commentId: string,
): Promise<CommentWithAuthor | undefined> {
  const [result] = await db
    .select({
      id: comments.id,
      userId: comments.user_id,
      postId: comments.post_id,
      parentId: comments.parent_id,
      content: comments.content,
      createdAt: comments.created_at,
      updatedAt: comments.updated_at,
      author: {
        id: users.id,
        username: users.username,
        displayName: users.display_name,
        avatarUrl: users.avatar_url,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.id))
    .where(eq(comments.id, commentId))
    .limit(1);
  return result;
}

export async function createComment(data: CreateCommentRepositoryInput) {
  try {
    const [comment] = await db
      .insert(comments)
      .values({
        user_id: data.userId,
        post_id: data.postId,
        parent_id: data.parentId ?? null,
        content: data.content,
      })
      .returning();
    return comment;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function updateComment(commentId: string, content: string) {
  try {
    const [comment] = await db
      .update(comments)
      .set({
        content,
        updated_at: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();
    return comment;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function deleteComment(commentId: string) {
  try {
    const [comment] = await db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning();
    return comment;
  } catch (error) {
    handleDatabaseError(error);
  }
}
