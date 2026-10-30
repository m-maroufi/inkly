import { Response, Request, NextFunction } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  checkFollowStatusService,
  getUserFollowersService,
  getUserFollowingService,
  toggleFollowService,
} from "./follow.service";
import { userIdParamSchema } from "./follow.schema";

export async function toggleFollowController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const followerId = req.user.id;
    const followingId = userIdParamSchema.parse(req.params).userId;

    const followResult = await toggleFollowService(followerId, followingId);

    res.status(200).json({
      success: true,
      data: followResult,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkFollowStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const followerId = req.user.id;
    const followingId = userIdParamSchema.parse(req.params).userId;

    const followResult = await checkFollowStatusService(
      followerId,
      followingId,
    );

    res.status(200).json({
      success: true,
      data: followResult,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserFollowersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = userIdParamSchema.parse(req.params);
    const result = await getUserFollowersService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserFollowingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = userIdParamSchema.parse(req.params);

    const result = await getUserFollowingService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
