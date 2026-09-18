import { createHash } from "node:crypto";
import {
  deleteRedisValue,
  getRedisValue,
  setRedisValue,
} from "../../../lib/redis/redis.store";

const PASSWORD_RESET_TOKEN_TTL = 15 * 60;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
function getTokenKey(token: string) {
  return `password_reset:${hashToken(token)}`;
}

export async function storePasswordResetToken(token: string, userId: string) {
  const key = getTokenKey(token);

  await setRedisValue(key, userId, PASSWORD_RESET_TOKEN_TTL);
}

export async function getUserIdByPasswordResetToken(token: string) {
  const key = getTokenKey(token);

  return getRedisValue(key);
}

export async function deletePasswordResetToken(token: string) {
  const key = getTokenKey(token);

  await deleteRedisValue(key);
}
