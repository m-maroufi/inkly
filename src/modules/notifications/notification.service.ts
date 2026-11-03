import { AppError } from "../../shared/errors/app-error";
import { AuthorizationError } from "../../shared/errors/authorization-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findUserById } from "../users/user.repository";
import {
  countUnreadNotifications,
  createNotification,
  findNotificationById,
  findUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.repository";
import { CreateNotificationInput } from "./notification.types";

export async function getUserNotificationsService(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("user not found.");
  }

  const notifications = await findUserNotifications(userId);
  const unreadCount = await countUnreadNotifications(userId);

  return {
    notifications,
    unreadCount,
  };
}

export async function getUnreadCountService(userId: string) {
  const unreadCount = await countUnreadNotifications(userId);
  return { unreadCount };
}

export async function markNotificationAsReadService(
  userId: string,
  notificationId: string,
) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("user not found.");
  }

  const notification = await findNotificationById(notificationId);
  if (!notification) {
    throw new NotFoundError("Notification not found.");
  }

  if (notification.recipient_id !== userId) {
    throw new AuthorizationError(
      "You are not allowed to access this notification.",
    );
  }
  const notify = await markNotificationAsRead(notificationId);
  if (!notify) {
    throw new AppError("failed to mark read A notification.", 500);
  }
  return { id: notify.id, readAt: notify.read_at ?? new Date() };
}

export async function markAllAsReadService(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("user not found.");
  }

  const updatedList = await markAllNotificationsAsRead(userId);
  if (!updatedList) {
    throw new AppError("failed to mark read All notification.", 500);
  }
  return {
    count: updatedList.length,
    message: "All notifications marked as read.",
  };
}

export async function createNotificationService(data: CreateNotificationInput) {
  if (data.actorId && data.actorId === data.recipientId) return;
  const notification = await createNotification(data);
  return notification;
}
