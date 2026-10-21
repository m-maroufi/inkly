import { NextFunction, Response, Request } from "express";
import {
  approvePostService,
  createPostService,
  deletePostService,
  getAuthorPostByIdService,
  getAuthorPostsService,
  getPendingPostsService,
  getPublishedPostDetailsService,
  getPublishedPostsService,
  publishPostService,
  rejectPostService,
  submitPostForReviewService,
  updatePostService,
} from "./post.service";
import {
  createPostSchema,
  rejectPostSchema,
  updatePostSchema,
} from "./post.schema";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { AuthorizationError } from "../../shared/errors/authorization-error";

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

export async function deletePostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }

    const deletedPost = await deletePostService(req.user, postId);
    res.status(200).json({
      success: true,
      data: {
        id: deletedPost.id,
        title: deletedPost.title,
        message: `Post "${deletedPost.title}" has been deleted successfully.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitPostForReviewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }
    const post = await submitPostForReviewService(req.user.id, postId);
    res.status(200).json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        status: post.status,
        message: "Post submitted for review successfully.",
      },
    });
  } catch (error) {
    next(error);
  }
}

// admin controller -> only admin access that controller

export async function getPendingPostsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const posts = await getPendingPostsService();
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function approvePostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    if (req.user.role !== "ADMIN") {
      throw new AuthorizationError(
        "You do not have permission to perform this action.",
      );
    }
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }
    const post = await approvePostService(postId);
    res.status(200).json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        status: post.status,
        message: "Post approved successfully.",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    if (req.user.role !== "ADMIN") {
      throw new AuthorizationError(
        "You do not have permission to perform this action.",
      );
    }
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }
    const { reason } = rejectPostSchema.parse(req.body);

    const post = await rejectPostService(postId, reason);

    res.status(200).json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        status: post.status,
        reason,
        message: "Post rejected.",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function publishPostController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    if (req.user.role !== "ADMIN") {
      throw new AuthorizationError(
        "You do not have permission to perform this action.",
      );
    }
    const postId = req.params.postId;

    if (typeof postId !== "string" || !postId.trim()) {
      throw new NotFoundError("Post not found.");
    }
    const post = await publishPostService(postId);

    res.status(200).json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        status: post.status,
        message: "Post published successfully.",
      },
    });
  } catch (error) {
    next(error);
  }
}
