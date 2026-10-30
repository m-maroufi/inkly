import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  getMyProfileController,
  getPublicProfileByUsernameController,
  getUserPublishedPostsController,
  updateMyProfileController,
} from "./user.controller";

export const userRouter = Router();

// روت‌های پروفایل شخصی (نیاز به لاگین)
userRouter.get("/me", authMiddleware, getMyProfileController);
userRouter.patch(
  "/me",
  authMiddleware,
  upload.single("avatar"),
  updateMyProfileController,
);

// روت‌های عمومی نویسندگان
userRouter.get("/:username/posts", getUserPublishedPostsController);
userRouter.get("/:username", getPublicProfileByUsernameController);
