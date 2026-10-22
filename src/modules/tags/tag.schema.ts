import z from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters.")
    .max(50, "Tag name must be at most 50 characters."),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters.")
    .max(50, "Tag name must be at most 50 characters."),
});

export const tagIdParamSchema = z.object({
  tagId: z.uuid("Invalid tag ID."),
});

export const tagSlugParamSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
});
