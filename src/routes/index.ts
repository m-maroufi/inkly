import { Router } from "express";
import { healthRouter } from "./health.route";
import { categoryRouter } from "../modules/categories/category.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { postRouter } from "../modules/posts/post.routes";
import { tagsRouter } from "../modules/tags/tag.routes";
import { commentRouter } from "../modules/comments/comment.routes";
import { likeRouter } from "../modules/likes/like.routes";
import { bookmarkRouter } from "../modules/bookmarks/bookmark.routes";
import { followRouter } from "../modules/follows/follow.routes";
import { userRouter } from "../modules/users/user.routes";

export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);

apiV1Router.use("/categories", categoryRouter);

apiV1Router.use("/auth", authRouter);

apiV1Router.use("/posts", postRouter);

apiV1Router.use("/tags", tagsRouter);

apiV1Router.use("/comments", commentRouter);

apiV1Router.use("/likes", likeRouter);

apiV1Router.use("/bookmarks", bookmarkRouter);

apiV1Router.use("/follows", followRouter);

apiV1Router.use("/users", userRouter);
