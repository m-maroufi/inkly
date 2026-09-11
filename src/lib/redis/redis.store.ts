import { redisClient } from "./redis.client";

export async function setRedisValue(
  key: string,
  value: string,
  ttlInSeconds?: number,
) {
  if (ttlInSeconds) {
    await redisClient.set(key, value, {
      EX: ttlInSeconds,
    });

    return;
  }

  await redisClient.set(key, value);
}

export async function getRedisValue(key: string) {
  return redisClient.get(key);
}

export async function deleteRedisValue(key: string) {
  await redisClient.del(key);
}

export async function hasRedisKey(key: string) {
  return (await redisClient.exists(key)) === 1;
}
