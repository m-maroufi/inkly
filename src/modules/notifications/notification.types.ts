import { notifications, notificationType } from "../../db/schema/notifications";

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationType = (typeof notificationType.enumValues)[number];

// داده‌های ورودی برای ساخت نوتیفیکیشن جدید در سیستم
export type CreateNotificationInput = {
  recipientId: string;
  actorId?: string | null;
  type: NotificationType;
  postId?: string | null;
  commentId?: string | null;
};

// اطلاعات کامل هر نوتیفیکیشن برای نمایش در رابط کاربری
export type NotificationItem = {
  id: string;
  type: NotificationType;
  readAt: Date | null;
  createdAt: Date;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  post: {
    id: string;
    title: string;
    slug: string;
  } | null;
  comment: {
    id: string;
    content: string;
  } | null;
};
