import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  deleteMediaController,
  getMediaByIdController,
  getMyMediaController,
  updateMediaController,
  uploadMediaController,
} from "./media.controller";

export const mediaRouter = Router();

// ۱. آپلود فایل جدید (نیاز به لاگین و دریافت فایل از فیلد 'file')
mediaRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadMediaController,
);

// ۲. دریافت لیست رسانه‌های کاربر جاری
mediaRouter.get("/", authMiddleware, getMyMediaController);

// ۳. دریافت مشخصات یک رسانه (عمومی)
mediaRouter.get("/:mediaId", getMediaByIdController);

// ۴. ویرایش مشخصات رسانه (فقط مالک یا ادمین)
mediaRouter.patch("/:mediaId", authMiddleware, updateMediaController);

// ۵. حذف رسانه از کلودیناری و دیتابیس (فقط مالک یا ادمین)
mediaRouter.delete("/:mediaId", authMiddleware, deleteMediaController);
