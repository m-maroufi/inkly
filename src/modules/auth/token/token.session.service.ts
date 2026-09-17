import { findUserById } from "../email/email.repository";
import { createAccessToken, rotateRefreshToken } from "./token.service";
import { AuthenticationError } from "../../../shared/errors/authentication-error";

export async function refreshSession(refreshToken: string) {
  const tokenResult = await rotateRefreshToken(refreshToken);

  const user = await findUserById(tokenResult.userId);

  if (!user) {
    throw new AuthenticationError(
      "User associated with refresh token not found.",
    );
  }

  const accessToken = await createAccessToken(user.id, user.role);

  return {
    accessToken,
    refreshToken: tokenResult.token,
  };
}
