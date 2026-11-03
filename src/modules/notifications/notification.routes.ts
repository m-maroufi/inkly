import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getUnreadCountController,
  getUserNotificationsController,
  markAllAsReadController,
  markNotificationAsReadController,
} from "./notification.controller";

export const notificationRouter = Router();

// تمام روت‌های اعلان‌ها نیاز به احراز هویت دارند
notificationRouter.use(authMiddleware);

// ۱. دریافت صندوق اعلان‌ها
notificationRouter.get("/", getUserNotificationsController);

// ۲. تعداد اعلان‌های خوانده‌نشده
notificationRouter.get("/unread-count", getUnreadCountController);

// ۳. علامت‌گذاری تمام اعلان‌ها به عنوان خوانده‌شده
notificationRouter.patch("/read-all", markAllAsReadController);

// ۴. علامت‌گذاری یک اعلان خاص به عنوان خوانده‌شده
notificationRouter.patch(
  "/:notificationId/read",
  markNotificationAsReadController,
);
