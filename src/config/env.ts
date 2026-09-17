import dotenv from "dotenv";
import { envSchema } from "./env.schema";
import z from "zod";

dotenv.config();
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(z.prettifyError(parsedEnv.error));
  process.exit(1);
}
export const env = {
  port: parsedEnv.data.PORT,
  logLevel: parsedEnv.data.LOG_LEVEL,
  envNode: parsedEnv.data.NODE_ENV,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  redisUrl: parsedEnv.data.REDIS_URL,
  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES_IN,
  refreshTokenCookieName: parsedEnv.data.REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieMaxAge: parsedEnv.data.REFRESH_TOKEN_COOKIE_MAX_AGE,
  resendApiKey: parsedEnv.data.RESEND_API_KEY,
  emailFrom: parsedEnv.data.EMAIL_FROM,
};
