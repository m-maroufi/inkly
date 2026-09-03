import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  envNode: process.env.NODE_ENV,
};
