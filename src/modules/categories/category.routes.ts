import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/authorization.middleware";

export const categoryRouter = Router();
//public
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/id/:id", getCategoryByIdController);
categoryRouter.get("/:slug", getCategoryBySlugController);
// only admin
categoryRouter.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  createCategoryController,
);
categoryRouter.patch(
  "/id/:id",
  authMiddleware,
  requireRole("ADMIN"),
  updateCategoryController,
);
categoryRouter.delete(
  "/id/:id",
  authMiddleware,
  requireRole("ADMIN"),
  deleteCategoryController,
);
