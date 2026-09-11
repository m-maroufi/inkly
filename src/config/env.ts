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
  redis_url: parsedEnv.data.REDIS_URL,
};
