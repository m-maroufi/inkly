import { NextFunction, Response, Request } from "express";
import { createPostService } from "./post.service";
import { createPostSchema } from "./post.schema";
import { AuthenticationError } from "../../shared/errors/authentication-error";

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
