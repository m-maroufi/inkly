import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import {
  mediaIdParamSchema,
  updateMediaSchema,
  uploadMediaSchema,
} from "./media.schema";
import {
  deleteMediaService,
  getMediaByIdService,
  getMyMediaService,
  updateMediaService,
  uploadMediaService,
} from "./media.service";

// ۱. کنترلر آپلود رسانه
export async function uploadMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const data = uploadMediaSchema.parse(req.body);
    const file = req.file;

    const newMedia = await uploadMediaService(userId, file, data);

    res.status(201).json({
      success: true,
      message: "Media uploaded successfully.",
      data: newMedia,
    });
  } catch (error) {
    next(error);
  }
}

// ۲. کنترلر دریافت کتابخانه رسانه‌های من
export async function getMyMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const mediaList = await getMyMediaService(userId);

    res.status(200).json({
      success: true,
      data: mediaList,
    });
  } catch (error) {
    next(error);
  }
}

// ۳. کنترلر مشاهده مشخصات یک رسانه با شناسه
export async function getMediaByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { mediaId } = mediaIdParamSchema.parse(req.params);
    const item = await getMediaByIdService(mediaId);

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

// ۴. کنترلر ویرایش اطلاعات رسانه (altText)
export async function updateMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const userRole = req.user.role;
    const { mediaId } = mediaIdParamSchema.parse(req.params);
    const data = updateMediaSchema.parse(req.body);

    const updatedMedia = await updateMediaService(
      userId,
      mediaId,
      data,
      userRole,
    );

    res.status(200).json({
      success: true,
      message: "Media updated successfully.",
      data: updatedMedia,
    });
  } catch (error) {
    next(error);
  }
}

// ۵. کنترلر حذف رسانه
export async function deleteMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const userId = req.user.id;
    const userRole = req.user.role;
    const { mediaId } = mediaIdParamSchema.parse(req.params);

    await deleteMediaService(userId, mediaId, userRole);

    res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
