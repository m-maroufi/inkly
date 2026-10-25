import { Router } from "express";
import {
  getPostLikesController,
  toggleLikeController,
  checkLikeStatusController,
} from "./like.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const likeRouter = Router();

likeRouter.post("/post/:postId", authMiddleware, toggleLikeController);
likeRouter.get("/post/:postId", getPostLikesController);
likeRouter.get(
  "/post/:postId/status",
  authMiddleware,
  checkLikeStatusController,
);
