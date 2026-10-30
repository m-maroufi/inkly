import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  checkFollowStatusController,
  getUserFollowersController,
  getUserFollowingController,
  toggleFollowController,
} from "./follow.controller";

export const followRouter = Router();

followRouter.get("/:userId/followers", getUserFollowersController);
followRouter.get("/:userId/following", getUserFollowingController);

followRouter.get(
  "/:userId/status",
  authMiddleware,
  checkFollowStatusController,
);
followRouter.post("/:userId", authMiddleware, toggleFollowController);
