import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { refresh_tokens } from "../../../db/schema/refresh_tokens";

export async function createRefreshToken(data: {
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
}) {
  const [token] = await db
    .insert(refresh_tokens)
    .values({
      user_id: data.userId,
      token_hash: data.tokenHash,
      family_id: data.familyId,
      expires_at: data.expiresAt,
    })
    .returning();
  if (!token) {
    throw new Error("Failed to create refresh token.");
  }

  return token;
}

export async function findRefreshTokenByHash(tokenHash: string) {
  const [token] = await db
    .select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token_hash, tokenHash))
    .limit(1);
  return token;
}

export async function revokeRefreshToken(tokenId: string) {
  const [token] = await db
    .update(refresh_tokens)
    .set({
      revoked_at: new Date(),
    })
    .where(eq(refresh_tokens.id, tokenId))
    .returning();
  return token;
}

export async function revokeRefreshTokenFamily(familyId: string) {
  await db
    .update(refresh_tokens)
    .set({
      revoked_at: new Date(),
    })
    .where(
      and(
        eq(refresh_tokens.family_id, familyId),
        isNull(refresh_tokens.revoked_at),
      ),
    );
}
