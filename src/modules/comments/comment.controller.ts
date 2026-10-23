import { NextFunction, Request, Response } from "express";
import {
  commentIdParamSchema,
  createCommentSchema,
  postIdParamSchema,
  updateCommentSchema,
} from "./comment.schema";
import {
  createCommentService,
  deleteCommentService,
  getCommentsByPostIdService,
  updateCommentService,
} from "./comment.service";
import { AuthenticationError } from "../../shared/errors/authentication-error";

export async function getCommentsByPostIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = postIdParamSchema.parse(req.params);
    const comments = await getCommentsByPostIdService(postId);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCommentController(
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

    const data = createCommentSchema.parse(req.body);

    const comment = await createCommentService(userId, postId, data);

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCommentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const { commentId } = commentIdParamSchema.parse(req.params);

    const data = updateCommentSchema.parse(req.body);

    const comment = await updateCommentService(commentId, userId, data);

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const { commentId } = commentIdParamSchema.parse(req.params);

    const result = await deleteCommentService(commentId, req.user);
    res.status(200).json({
      success: true,
      data: {
        commentId: result.id,
        message: `comment Delete successfully.`,
      },
    });
  } catch (error) {
    next(error);
  }
}
