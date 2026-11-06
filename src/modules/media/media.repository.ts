import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { media } from "../../db/schema/media";
import { handleDatabaseError } from "../../shared/errors/database-error";
import {
  CreateMediaRepositoryInput,
  Media,
  UpdateMediaInput,
} from "./media.types";

// ۱. درج فایل جدید در دیتابیس
export async function createMedia(
  data: CreateMediaRepositoryInput,
): Promise<Media | undefined> {
  try {
    const [result] = await db
      .insert(media)
      .values({
        uploaded_by: data.uploadedBy,
        original_name: data.originalName,
        storage_key: data.storageKey,
        url: data.url,
        media_type: data.mediaType,
        mime_type: data.mimeType ?? null,
        size: data.size ?? null,
        width: data.width ?? null,
        height: data.height ?? null,
        alt_text: data.altText ?? null,
      })
      .returning();

    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
}

// ۲. یافتن رسانه بر اساس شناسه
export async function findMediaById(id: string): Promise<Media | undefined> {
  const [result] = await db
    .select()
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  return result;
}

// ۳. دریافت لیست تمام رسانه‌های یک کاربر
export async function findMediaByUserId(userId: string): Promise<Media[]> {
  const result = await db
    .select()
    .from(media)
    .where(eq(media.uploaded_by, userId))
    .orderBy(desc(media.created_at));

  return result;
}

// ۴. به‌روزرسانی مشخصات رسانه (alt_text)
export async function updateMedia(
  id: string,
  data: UpdateMediaInput,
): Promise<Media | undefined> {
  try {
    const [result] = await db
      .update(media)
      .set({
        alt_text: data.altText,
        updated_at: new Date(),
      })
      .where(eq(media.id, id))
      .returning();

    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
}

// ۵. حذف رکورد رسانه از دیتابیس
export async function deleteMediaById(id: string): Promise<Media | undefined> {
  try {
    const [result] = await db.delete(media).where(eq(media.id, id)).returning();

    return result;
  } catch (error) {
    handleDatabaseError(error);
  }
}
