import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/authorization.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  createPostController,
  getPublishedPostsController,
  getPublishedPostDetailsController,
  getAuthorPostsController,
} from "./post.controller";

export const postRouter = Router();

postRouter.get("/", getPublishedPostsController);
postRouter.get(
  "/me",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  getAuthorPostsController,
);
postRouter.get("/:slug", getPublishedPostDetailsController);
postRouter.post(
  "/",
  authMiddleware,
  requireRole("AUTHOR", "ADMIN"),
  upload.single("coverImage"),
  createPostController,
);
