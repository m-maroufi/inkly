import { Router } from "express";
import {
  getAllTagsController,
  getTagByIdController,
  getTagBySlugController,
  deleteTagController,
  createTagController,
  updateTagController,
} from "./tag.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/authorization.middleware";

export const tagsRouter = Router();

tagsRouter.get("/", getAllTagsController);
tagsRouter.get("/id/:tagId", getTagByIdController);
tagsRouter.get("/:slug", getTagBySlugController);

tagsRouter.post("/", authMiddleware, requireRole("ADMIN"), createTagController);

tagsRouter.patch(
  "/id/:tagId",
  authMiddleware,
  requireRole("ADMIN"),
  updateTagController,
);

tagsRouter.delete(
  "/id/:tagId",
  authMiddleware,
  requireRole("ADMIN"),
  deleteTagController,
);
