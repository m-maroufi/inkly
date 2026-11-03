import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  getUnreadCountService,
  getUserNotificationsService,
  markAllAsReadService,
  markNotificationAsReadService,
} from "./notification.service";
import { notificationIdParamSchema } from "./notification.schema";

export async function getUserNotificationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const result = await getUserNotificationsService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCountController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const result = await getUnreadCountService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsReadController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const { notificationId } = notificationIdParamSchema.parse(req.params);

    const result = await markNotificationAsReadService(userId, notificationId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsReadController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;

    const result = await markAllAsReadService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
