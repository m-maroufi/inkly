import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/authorization.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  createPostController,
  getPublishedPostsController,
  getPublishedPostDetailsController,
  getAuthorPostsController,
  getAuthorPostByIdController,
  updatePostController,
  deletePostController,
  submitPostForReviewController,
  approvePostController,
  publishPostController,
  rejectPostController,
  getPendingPostsController,
} from "./post.controller";

export const postRouter = Router();

postRouter.get("/", getPublishedPostsController);
postRouter.get(
  "/me",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  getAuthorPostsController,
);
postRouter.get(
  "/me/:postId",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  getAuthorPostByIdController,
);

postRouter.post(
  "/",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  upload.single("coverImage"),
  createPostController,
);

postRouter.patch(
  "/me/:postId",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  upload.single("coverImage"),
  updatePostController,
);

postRouter.delete(
  "/me/:postId",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  deletePostController,
);

postRouter.patch(
  "/me/:postId/submit",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  submitPostForReviewController,
);

// --- Admin Routes ---
postRouter.get(
  "/admin/pending",
  authMiddleware,
  requireRole("ADMIN"),
  getPendingPostsController,
);

postRouter.patch(
  "/admin/:postId/approve",
  authMiddleware,
  requireRole("ADMIN"),
  approvePostController,
);

postRouter.patch(
  "/admin/:postId/reject",
  authMiddleware,
  requireRole("ADMIN"),
  rejectPostController,
);

postRouter.patch(
  "/admin/:postId/publish",
  authMiddleware,
  requireRole("ADMIN"),
  publishPostController,
);

postRouter.get("/:slug", getPublishedPostDetailsController);
