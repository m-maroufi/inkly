// src/config/env.schema.ts

import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.url(),
});
