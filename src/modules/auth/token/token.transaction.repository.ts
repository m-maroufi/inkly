import { db } from "../../../db";
import { refresh_tokens } from "../../../db/schema/refresh_tokens";
import { eq } from "drizzle-orm";

export async function rotateRefreshTokenTransaction(
  tokenId: string,
  userId: string,
  familyId: string,
  tokenHash: string,
  expiresAt: Date,
) {
  return db.transaction(async (tx) => {
    await tx
      .update(refresh_tokens)
      .set({
        revoked_at: new Date(),
      })
      .where(eq(refresh_tokens.id, tokenId));

    const [newToken] = await tx
      .insert(refresh_tokens)
      .values({
        user_id: userId,
        token_hash: tokenHash,
        family_id: familyId,
        expires_at: expiresAt,
      })
      .returning();

    if (!newToken) {
      throw new Error("Failed to create refresh token.");
    }

    return newToken;
  });
}
