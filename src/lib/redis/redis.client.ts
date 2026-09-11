import { createClient } from "redis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";

export const redisClient = createClient({
  url: env.redis_url,
});

redisClient.on("error", (error) => {
  logger.error({ error: error }, "Redis client error");
});

export async function connectRedis() {
  await redisClient.connect();

  logger.info("Redis connected");
}
