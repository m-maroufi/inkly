import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { follows } from "../../db/schema/follows";
import { Follow, FollowUserItem } from "./follow.types";
import { users } from "../../db/schema/users";

export async function findFollow(
  followerId: string,
  followingId: string,
): Promise<Follow | undefined> {
  const [result] = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_id, followerId),
        eq(follows.following_id, followingId),
      ),
    );
  return result;
}

export async function createFollow(
  followerId: string,
  followingId: string,
): Promise<Follow | undefined> {
  const [result] = await db
    .insert(follows)
    .values({
      follower_id: followerId,
      following_id: followingId,
    })
    .returning();
  return result;
}

export async function deleteFollow(
  followerId: string,
  followingId: string,
): Promise<Follow | undefined> {
  const [result] = await db
    .delete(follows)
    .where(
      and(
        eq(follows.follower_id, followerId),
        eq(follows.following_id, followingId),
      ),
    )
    .returning();

  return result;
}

export async function countFollowers(userId: string): Promise<number> {
  const [resutl] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.following_id, userId));

  return resutl ? resutl.count : 0;
}

export async function countFollowing(userId: string): Promise<number> {
  const [resutl] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.follower_id, userId));

  return resutl ? resutl.count : 0;
}

export async function findFollowersByUserId(
  userId: string,
): Promise<FollowUserItem[]> {
  const followingList = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatar_url,
      displayName: users.display_name,
      bio: users.bio,
      followedAt: follows.created_at,
    })
    .from(follows)
    .innerJoin(users, eq(follows.follower_id, users.id))
    .where(eq(follows.following_id, userId))
    .orderBy(desc(follows.created_at));
  return followingList;
}

export async function findFollowingByUserId(
  userId: string,
): Promise<FollowUserItem[]> {
  const followingList = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatar_url,
      displayName: users.display_name,
      bio: users.bio,
      followedAt: follows.created_at,
    })
    .from(follows)
    .innerJoin(users, eq(follows.following_id, users.id))
    .where(eq(follows.follower_id, userId))
    .orderBy(desc(follows.created_at));
  return followingList;
}
