import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
} from "./category.controller";

export const categoryRouter = Router();

categoryRouter.post("/", createCategoryController);
categoryRouter.get("/", getAllCategoriesController);
