import { z } from "zod";

export const emailRegisterSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain English letters, numbers, and underscores.",
    ),

  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be at most 50 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter.")
    .regex(/\d/, "Password must contain at least one number."),
});
