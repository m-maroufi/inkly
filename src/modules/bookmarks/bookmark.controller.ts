import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  checkBookmarkStatusService,
  getMyBookmarksService,
  toggleBookmarkService,
} from "./bookmark.service";
import { postIdParamSchema } from "./bookmark.schema";

export async function toggleBookmarkController(
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

    const bookmarked = await toggleBookmarkService(userId, postId);

    res.status(200).json({
      success: true,
      data: bookmarked,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkBookmarkStatusController(
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

    const bookmarked = await checkBookmarkStatusService(userId, postId);

    res.status(200).json({
      success: true,
      data: bookmarked,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyBookmarksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const bookmarkedList = await getMyBookmarksService(userId);

    res.status(200).json({
      success: true,
      data: bookmarkedList,
    });
  } catch (error) {
    next(error);
  }
}
