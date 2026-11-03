import { Router } from "express";
import { optionalAuthMiddleware } from "../../middlewares/auth.middleware";
import {
  getPostViewsCountController,
  recordPostViewController,
} from "./view.controller";

export const viewRouter = Router();

// ثبت بازدید جدید (عمومی با قابلیت شناسایی اختیاری کاربر)
viewRouter.post(
  "/post/:postId",
  optionalAuthMiddleware,
  recordPostViewController,
);

// مشاهده تعداد کل بازدیدها (عمومی)
viewRouter.get("/post/:postId", getPostViewsCountController);
