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

const secret = new TextEncoder().encode(env.jwtAccessSecret);

function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export async function createAccessToken(userId: string, role: UserRole) {
  return new SignJWT({ role })
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
