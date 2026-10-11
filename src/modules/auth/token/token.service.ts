import { jwtVerify, SignJWT } from "jose";
import { env } from "../../../config/env";
import type { UserRole } from "../../../db/schema/users";
import { accessTokenPayloadSchema } from "./token.types";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  createRefreshToken as createRefreshTokenRecord,
  findRefreshTokenByHash,
  revokeRefreshTokenFamily,
} from "./token.repository";
import { AuthenticationError } from "../../../shared/errors/authentication-error";
import { rotateRefreshTokenTransaction } from "./token.transaction.repository";
import { addDays } from "../../../shared/utils/date";
import {
  getRedisValue,
  hasRedisKey,
  incrementRedisValue,
  setRedisValue,
} from "../../../lib/redis/redis.store";

const secret = new TextEncoder().encode(env.jwtAccessSecret);

function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export async function createAccessToken(userId: string, role: UserRole) {
  const tokenVersion = await getUserTokenVersion(userId);

  return new SignJWT({
    role,
    ver: tokenVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.jwtAccessExpiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  return accessTokenPayloadSchema.parse(payload);
}

// refresh token

export async function createRefreshToken(userId: string, familyId?: string) {
  const token = randomBytes(32).toString("hex");

  // hashing token
  const tokenHash = hashRefreshToken(token);

  const tokenFamilyId = familyId ?? randomUUID();

  const expiresAt = addDays(30); // 30 day

  await createRefreshTokenRecord({
    userId,
    tokenHash,
    familyId: tokenFamilyId,
    expiresAt,
  });

  return {
    token,
    familyId: tokenFamilyId,
    expiresAt,
  };
}

export async function verifyRefreshToken(token: string) {
  const tokenHash = hashRefreshToken(token);

  const tokenRecord = await findRefreshTokenByHash(tokenHash);

  if (!tokenRecord) {
    throw new AuthenticationError("Invalid refresh token.");
  }

  if (tokenRecord.expires_at < new Date()) {
    throw new AuthenticationError("Refresh token has expired.");
  }

  if (tokenRecord.revoked_at) {
    await revokeRefreshTokenFamily(tokenRecord.family_id);

    throw new AuthenticationError("Invalid refresh token.");
  }

  return tokenRecord;
}

export async function rotateRefreshToken(token: string) {
  const tokenRecord = await verifyRefreshToken(token);

  const newToken = randomBytes(32).toString("hex");
  const tokenHash = hashRefreshToken(newToken);

  const expiresAt = addDays(30);

  await rotateRefreshTokenTransaction(
    tokenRecord.id,
    tokenRecord.user_id,
    tokenRecord.family_id,
    tokenHash,
    expiresAt,
  );

  return {
    token: newToken,
    userId: tokenRecord.user_id,
    familyId: tokenRecord.family_id,
    expiresAt,
  };
}

const REVOKED_ACCESS_TOKEN_PREFIX = "auth:revoked-access:";

function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function revokeAccessToken(token: string): Promise<void> {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  // مطمئن می‌شویم payload متعلق به Access Token معتبر Inkly است.
  accessTokenPayloadSchema.parse(payload);

  if (typeof payload.exp !== "number") {
    throw new AuthenticationError("Invalid access token expiration.");
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const ttlInSeconds = payload.exp - nowInSeconds;

  if (ttlInSeconds <= 0) {
    throw new AuthenticationError("Access token has expired.");
  }

  const key = `${REVOKED_ACCESS_TOKEN_PREFIX}${hashAccessToken(token)}`;

  await setRedisValue(key, "1", ttlInSeconds);
}

export async function isAccessTokenRevoked(token: string): Promise<boolean> {
  const key = `${REVOKED_ACCESS_TOKEN_PREFIX}${hashAccessToken(token)}`;

  return hasRedisKey(key);
}

const USER_TOKEN_VERSION_PREFIX = "auth:user-token-version:";

async function getUserTokenVersion(userId: string): Promise<number> {
  const value = await getRedisValue(`${USER_TOKEN_VERSION_PREFIX}${userId}`);

  if (value === null) {
    return 0;
  }

  const version = Number(value);

  if (!Number.isSafeInteger(version) || version < 0) {
    throw new Error("Invalid user token version in Redis.");
  }

  return version;
}

export async function incrementUserTokenVersion(
  userId: string,
): Promise<number> {
  return incrementRedisValue(`${USER_TOKEN_VERSION_PREFIX}${userId}`);
}

export async function isAccessTokenVersionCurrent(
  userId: string,
  tokenVersion: number,
): Promise<boolean> {
  const currentVersion = await getUserTokenVersion(userId);

  return currentVersion === tokenVersion;
}
