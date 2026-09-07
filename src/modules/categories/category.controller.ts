import { NextFunction, Request, Response } from "express";
import { createCategorySchema } from "./category.schema";
import { createCategoryService } from "./category.service";

export async function createCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await createCategoryService(data);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}
