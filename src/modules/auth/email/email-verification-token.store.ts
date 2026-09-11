import { createHash } from "node:crypto";
import {
  deleteRedisValue,
  getRedisValue,
  setRedisValue,
} from "../../../lib/redis/redis.store";

const EMAIL_VERIFICATION_TOKEN_TTL = 60 * 60 * 24;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getTokenKey(token: string) {
  return `email_verification:${hashToken(token)}`;
}

export async function storeEmailVerificationToken(
  token: string,
  userId: string,
) {
  const key = getTokenKey(token);

  await setRedisValue(key, userId, EMAIL_VERIFICATION_TOKEN_TTL);
}

export async function getUserIdByEmailVerificationToken(token: string) {
  const key = getTokenKey(token);

  return getRedisValue(key);
}

export async function deleteEmailVerificationToken(token: string) {
  const key = getTokenKey(token);

  await deleteRedisValue(key);
}
