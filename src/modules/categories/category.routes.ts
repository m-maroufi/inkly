import { Router } from "express";
import { createCategoryController } from "./category.controller";

export const categoryRouter = Router();

categoryRouter.post("/", createCategoryController);
