// src/config/env.schema.ts

import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1),
  REFRESH_TOKEN_COOKIE_MAX_AGE: z.coerce.number().int().positive(),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
  APP_URL: z.url(),
  FRONTEND_URL: z.url(),
});
