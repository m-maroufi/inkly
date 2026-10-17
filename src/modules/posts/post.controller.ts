import { NextFunction, Response, Request } from "express";
import {
  createPostService,
  getAuthorPostByIdService,
  getAuthorPostsService,
  getPublishedPostDetailsService,
  getPublishedPostsService,
  updatePostService,
} from "./post.service";
import { createPostSchema, updatePostSchema } from "./post.schema";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import { NotFoundError } from "../../shared/errors/not-found-error";

export async function createPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const data = createPostSchema.parse(req.body);
    const authorId = req.user.id;
    const imageBuffer = req.file?.buffer;

    const post = await createPostService(data, authorId, imageBuffer);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublishedPostsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const posts = await getPublishedPostsService();

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}
export async function getPublishedPostDetailsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string" || !slug.trim()) {
      throw new NotFoundError("Post not found.");
    }

    const post = await getPublishedPostDetailsService(slug);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuthorPostsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const authorId = req.user.id;
    const posts = await getAuthorPostsService(authorId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuthorPostByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const authorId = req.user.id;
    const postId = req.params.postId;
    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }

    const post = await getAuthorPostByIdService(authorId, postId);
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const authorId = req.user.id;
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }
    const imageBuffer = req.file?.buffer;
    
    const data = updatePostSchema.parse(req.body);

    const post = await updatePostService(postId, authorId, data, imageBuffer);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
}
