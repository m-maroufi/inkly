import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import { postIdParamSchema } from "./like.schema";
import {
  checkLikeStatusService,
  getPostLikesService,
  toggleLikeService,
} from "./like.service";

export async function toggleLikeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const { postId } = postIdParamSchema.parse(req.params);

    const liked = await toggleLikeService(userId, postId);

    res.status(200).json({
      success: true,
      data: liked,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkLikeStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const { postId } = postIdParamSchema.parse(req.params);

    const liked = await checkLikeStatusService(userId, postId);

    res.status(200).json({
      success: true,
      data: liked,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostLikesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = postIdParamSchema.parse(req.params);

    const liked = await getPostLikesService(postId);

    res.status(200).json({
      success: true,
      data: liked,
    });
  } catch (error) {
    next(error);
  }
}
