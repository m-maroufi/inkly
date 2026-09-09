import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  getCategoryBySlugController,
} from "./category.controller";

export const categoryRouter = Router();

categoryRouter.post("/", createCategoryController);

categoryRouter.get("/", getAllCategoriesController);

categoryRouter.get("/id/:id", getCategoryByIdController);

categoryRouter.get("/:slug", getCategoryBySlugController);
