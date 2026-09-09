import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
} from "./category.controller";

export const categoryRouter = Router();

categoryRouter.post("/", createCategoryController);
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/:id", getCategoryByIdController);
