import { NextFunction, Request, Response } from "express";
import {
  createTagService,
  deleteTagService,
  getAllTagsService,
  getTagByIdService,
  getTagBySlugService,
  updateTagService,
} from "./tag.service";
import {
  createTagSchema,
  tagIdParamSchema,
  tagSlugParamSchema,
  updateTagSchema,
} from "./tag.schema";

export async function getAllTagsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tags = await getAllTagsService();
    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTagByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { tagId } = tagIdParamSchema.parse(req.params);
    const tag = await getTagByIdService(tagId);
    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTagBySlugController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { slug } = tagSlugParamSchema.parse(req.params);
    const tag = await getTagBySlugService(slug);
    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = createTagSchema.parse(req.body);
    const tag = await createTagService(data);
    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { tagId } = tagIdParamSchema.parse(req.params);
    const data = updateTagSchema.parse(req.body);

    const tag = await updateTagService(data, tagId);
    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { tagId } = tagIdParamSchema.parse(req.params);
    const tag = await deleteTagService(tagId);
    res.status(200).json({
      success: true,
      data: {
        id: tag?.id,
        name: tag?.name,
        message: `Tag "${tag?.name}" has been deleted successfully.`,
      },
    });
  } catch (error) {
    next(error);
  }
}
