import { NextFunction, Request, Response } from "express";
import {
  categoryIdParamSchema,
  categorySlugParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryService,
} from "./category.service";

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

export async function getAllCategoriesController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = categoryIdParamSchema.parse(req.params);
    const category = await getCategoryById(id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlugController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { slug } = categorySlugParamSchema.parse(req.params);

    const category = await getCategoryBySlug(slug);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = categoryIdParamSchema.parse(req.params);
    const data = updateCategorySchema.parse(req.body);
    const category = await updateCategoryService(id, data);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = categoryIdParamSchema.parse(req.params);
    const category = await deleteCategoryService(id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}
