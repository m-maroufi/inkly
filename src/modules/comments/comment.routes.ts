import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentsByPostIdController,
  updateCommentController,
} from "./comment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const commentRouter = Router();

commentRouter.get("/post/:postId", getCommentsByPostIdController);

commentRouter.post("/post/:postId", authMiddleware, createCommentController);

commentRouter.patch("/:commentId", authMiddleware, updateCommentController);

commentRouter.delete("/:commentId", authMiddleware, deleteCommentController);
