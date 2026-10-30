import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be at most 50 characters.")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters.")
    .nullable()
    .optional(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain English letters, numbers and underscores.",
    )
    .optional(),
});

export const usernameParamSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
});
