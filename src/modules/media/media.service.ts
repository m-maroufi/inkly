import { UserRole } from "../../db/schema/users";
import {
  deleteImage,
  uploadImage,
} from "../../lib/cloudinary/cloudinary.service";
import { AppError } from "../../shared/errors/app-error";
import { AuthorizationError } from "../../shared/errors/authorization-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import {
  createMedia,
  deleteMediaById,
  findMediaById,
  findMediaByUserId,
  updateMedia,
} from "./media.repository";
import { UpdateMediaInput, UploadMediaInput } from "./media.types";

// ۱. سرویس آپلود رسانه
export async function uploadMediaService(
  userId: string,
  file: Express.Multer.File | undefined,
  data: UploadMediaInput,
) {
  if (!file) {
    throw new AppError("File is required.", 400);
  }

  // آپلود در کلودیناری
  const uploaded = await uploadImage(file.buffer, "inkly/media");

  // ذخیره اطلاعات رسانه در دیتابیس
  const newMedia = await createMedia({
    uploadedBy: userId,
    originalName: file.originalname,
    storageKey: uploaded.publicId,
    url: uploaded.url,
    mediaType: "IMAGE",
    mimeType: file.mimetype || null,
    size: file.size || null,
    altText: data.altText || null,
  });

  return newMedia;
}

// ۲. سرویس دریافت لیست رسانه‌های کاربر جاری
export async function getMyMediaService(userId: string) {
  return await findMediaByUserId(userId);
}

// ۳. سرویس دریافت مشخصات یک رسانه با شناسه
export async function getMediaByIdService(mediaId: string) {
  const item = await findMediaById(mediaId);
  if (!item) {
    throw new NotFoundError("Media not found.");
  }
  return item;
}

// ۴. سرویس ویرایش متادیتای رسانه
export async function updateMediaService(
  userId: string,
  mediaId: string,
  data: UpdateMediaInput,
  userRole?: UserRole,
) {
  const item = await findMediaById(mediaId);
  if (!item) {
    throw new NotFoundError("Media not found.");
  }

  // فقط مالک فایل یا ادمین اجازه ویرایش دارد
  if (item.uploaded_by !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("You are not allowed to update this media.");
  }

  return await updateMedia(mediaId, data);
}

// ۵. سرویس حذف کامل رسانه از کلودیناری و دیتابیس
export async function deleteMediaService(
  userId: string,
  mediaId: string,
  userRole?: UserRole,
) {
  const item = await findMediaById(mediaId);
  if (!item) {
    throw new NotFoundError("Media not found.");
  }

  // فقط مالک فایل یا ادمین اجازه حذف دارد
  if (item.uploaded_by !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("You are not allowed to delete this media.");
  }

  // ۱. حذف تصویر از کلودیناری
  await deleteImage(item.storage_key);

  // ۲. حذف رکورد از دیتابیس
  return await deleteMediaById(mediaId);
}
