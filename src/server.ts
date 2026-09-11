import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectRedis } from "./lib/redis/redis.client";

async function startServer() {
  await connectRedis();
  const app = createApp();
  app.listen(env.port, () => {
    logger.info({ port: env.port }, "Server started");
  });
}

startServer();
