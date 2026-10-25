import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { likes } from "../../db/schema/likes";
import { Like, LikedUser } from "./like.types";
import { handleDatabaseError } from "../../shared/errors/database-error";
import { users } from "../../db/schema/users";

export async function findLike(
  userId: string,
  postId: string,
): Promise<Like | undefined> {
  const [like] = await db
    .select()
    .from(likes)
    .where(and(eq(likes.user_id, userId), eq(likes.post_id, postId)));

  return like;
}

export async function createLike(userId: string, postId: string) {
  try {
    const [like] = await db
      .insert(likes)
      .values({
        user_id: userId,
        post_id: postId,
        created_at: new Date(),
      })
      .returning();

    return like;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function deleteLike(userId: string, postId: string) {
  const [like] = await db
    .delete(likes)
    .where(and(eq(likes.user_id, userId), eq(likes.post_id, postId)))
    .returning();
  return like;
}

export async function countLikesByPostId(postId: string) {
  const [result] = await db
    .select({
      totalCount: count(),
    })
    .from(likes)
    .where(eq(likes.post_id, postId));

  return result ? Number(result.totalCount) : 0;
}

export async function findLikedUsersByPostId(
  postId: string,
): Promise<LikedUser[]> {
  const usersList = await db
    .select({
      id: users.id,
      displayName: users.display_name,
      username: users.username,
      avatarUrl: users.avatar_url,
      likedAt: likes.created_at,
    })
    .from(users)
    .innerJoin(likes, eq(users.id, likes.user_id))
    .where(eq(likes.post_id, postId))
    .orderBy(desc(likes.created_at));

  return usersList;
}
