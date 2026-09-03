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
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  envNode: process.env.NODE_ENV,
};
