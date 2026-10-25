import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  toggleBookmarkController,
  checkBookmarkStatusController,
  getMyBookmarksController,
} from "./bookmark.controller";

export const bookmarkRouter = Router();

bookmarkRouter.get("/me", authMiddleware, getMyBookmarksController);

bookmarkRouter.post("/post/:postId", authMiddleware, toggleBookmarkController);

bookmarkRouter.get(
  "/post/:postId/status",
  authMiddleware,
  checkBookmarkStatusController,
);
