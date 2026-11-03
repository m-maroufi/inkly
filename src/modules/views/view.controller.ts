import { Request, Response, NextFunction } from "express";

import { postIdParamSchema } from "./view.schema";
import {
  getPostViewsCountService,
  recordPostViewService,
} from "./view.service";

export async function recordPostViewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = postIdParamSchema.parse(req.params);

    const ipAddress =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      req.ip ||
      null;

    const userAgent = req.headers["user-agent"] || null;
    const resutl = await recordPostViewService({
      postId,
      userId: req.user?.id ?? null,
      ipAddress,
      userAgent,
    });

    res.status(200).json({
      success: true,
      data: resutl,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostViewsCountController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { postId } = postIdParamSchema.parse(req.params);

    const resutl = await getPostViewsCountService(postId);

    res.status(200).json({
      success: true,
      data: resutl,
    });
  } catch (error) {
    next(error);
  }
}
