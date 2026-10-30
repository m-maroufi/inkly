import { Response, Request, NextFunction } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  getMyProfileService,
  getPublicProfileByUsernameService,
  getUserPublishedPostsService,
  updateMyProfileService,
} from "./user.service";
import { updateProfileSchema, usernameParamSchema } from "./user.schema";

export async function getMyProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const profile = await getMyProfileService(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const data = updateProfileSchema.parse(req.body);
    const bufferImage = req.file?.buffer;

    const updatedUser = await updateMyProfileService(userId, data, bufferImage);

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicProfileByUsernameController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = usernameParamSchema.parse(req.params);

    const profile = await getPublicProfileByUsernameService(username);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserPublishedPostsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = usernameParamSchema.parse(req.params);

    const posts = await getUserPublishedPostsService(username);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}
