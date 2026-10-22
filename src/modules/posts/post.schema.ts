import { z } from "zod";

const tagIdsSchema = z.preprocess(
  (val) => {
    if (!val) return undefined;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // اگر استرینگ تک بود
      }
      return [val];
    }
    return val;
  },
  z.array(z.uuid("Invalid tag ID.")).optional(),
);
export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),

  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt cannot be empty.")
    .max(500)
    .optional(),

  categoryId: z.uuid("Invalid category ID."),

  content: z.string().trim().min(1, "Content is required."),

  seoTitle: z
    .string()
    .trim()
    .min(1, "SEO title cannot be empty.")
    .max(200)
    .optional(),

  seoDescription: z
    .string()
    .trim()
    .min(1, "SEO description cannot be empty.")
    .max(500)
    .optional(),

  coverImageAlt: z
    .string()
    .trim()
    .min(1, "Cover image alt cannot be empty.")
    .max(200)
    .optional(),
  tagIds: tagIdsSchema,
});

export const updatePostSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty.").max(200).optional(),

  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt cannot be empty.")
    .max(500)
    .optional(),

  categoryId: z.uuid("Invalid category ID.").optional(),

  content: z.string().trim().min(1, "Content cannot be empty.").optional(),

  seoTitle: z
    .string()
    .trim()
    .min(1, "SEO title cannot be empty.")
    .max(200)
    .optional(),

  seoDescription: z
    .string()
    .trim()
    .min(1, "SEO description cannot be empty.")
    .max(500)
    .optional(),

  coverImageUrl: z.url("Invalid cover image URL.").optional(),

  coverImagePublicId: z.string().trim().min(1).optional(),

  coverImageAlt: z
    .string()
    .trim()
    .min(1, "Cover image alt cannot be empty.")
    .max(200)
    .optional(),

  
  tagIds: tagIdsSchema,
});

export const rejectPostSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Rejection reason is required.")
    .max(1000, "Rejection reason must be at most 1000 characters."),
});
