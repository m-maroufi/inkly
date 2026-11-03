import { count, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { notifications } from "../../db/schema/notifications";
import { handleDatabaseError } from "../../shared/errors/database-error";
import {
  CreateNotificationInput,
  NotificationItem,
} from "./notification.types";
import { users } from "../../db/schema/users";
import { posts } from "../../db/schema/posts";
import { comments } from "../../db/schema/comments";
import { and } from "drizzle-orm";

export async function createNotification(data: CreateNotificationInput) {
  try {
    const [not] = await db
      .insert(notifications)
      .values({
        actor_id: data.actorId,
        recipient_id: data.recipientId,
        post_id: data.postId ?? null,
        comment_id: data.commentId ?? null,
        type: data.type,
      })
      .returning();

    return not;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function findNotificationById(notId: string) {
  const [not] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, notId))
    .limit(1);
  return not;
}

export async function findUserNotifications(
  userId: string,
): Promise<NotificationItem[]> {
  const rawList = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      readAt: notifications.read_at,
      createdAt: notifications.created_at,
      actorId: users.id,
      actorUsername: users.username,
      actorDisplayName: users.display_name,
      actorAvatarUrl: users.avatar_url,
      postId: posts.id,
      postTitle: posts.title,
      postSlug: posts.slug,
      commentId: comments.id,
      commentContent: comments.content,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.actor_id, users.id))
    .leftJoin(posts, eq(notifications.post_id, posts.id))
    .leftJoin(comments, eq(notifications.comment_id, comments.id))
    .where(eq(notifications.recipient_id, userId))
    .orderBy(desc(notifications.created_at));

  return rawList.map((n) => ({
    id: n.id,
    type: n.type,
    readAt: n.readAt,
    createdAt: n.createdAt,
    actor: n.actorId
      ? {
          id: n.actorId,
          username: n.actorUsername ?? "",
          displayName: n.actorDisplayName ?? "",
          avatarUrl: n.actorAvatarUrl,
        }
      : null,
    post: n.postId
      ? {
          id: n.postId,
          title: n.postTitle ?? "",
          slug: n.postSlug ?? "",
        }
      : null,
    comment: n.commentId
      ? {
          id: n.commentId,
          content: n.commentContent ?? "",
        }
      : null,
  }));
}

export async function countUnreadNotifications(
  userId: string,
): Promise<number> {
  const [totalNotify] = await db
    .select({
      total: count(),
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.recipient_id, userId),
        isNull(notifications.read_at),
      ),
    );

  return totalNotify?.total ?? 0;
}

export async function markNotificationAsRead(notificationId: string) {
  const [notify] = await db
    .update(notifications)
    .set({
      read_at: new Date(),
    })
    .where(eq(notifications.id, notificationId))
    .returning();

  return notify;
}

export async function markAllNotificationsAsRead(userId: string) {
  const updatedList = await db
    .update(notifications)
    .set({
      read_at: new Date(),
    })
    .where(
      and(
        eq(notifications.recipient_id, userId),
        isNull(notifications.read_at),
      ),
    )
    .returning();

  return updatedList;
}
