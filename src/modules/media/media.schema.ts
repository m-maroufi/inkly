import { z } from "zod";

// موقع آپلود، متن جایگزین اختیاری است
export const uploadMediaSchema = z.object({
  altText: z
    .string()
    .trim()
    .max(255, "Alt text cannot exceed 255 characters.")
    .optional(),
});

// موقع ویرایش، حتماً باید متن جایگزین جدید ارسال شود
export const updateMediaSchema = z.object({
  altText: z
    .string()
    .trim()
    .min(1, "Alt text cannot be empty.")
    .max(255, "Alt text cannot exceed 255 characters."),
});

export const mediaIdParamSchema = z.object({
  mediaId: z.uuid("Invalid media ID."),
});
