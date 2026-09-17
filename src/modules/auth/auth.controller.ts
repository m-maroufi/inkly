import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { refreshSession } from "./token/token.session.service";
import { createHash } from "node:crypto";
import {
  findRefreshTokenByHash,
  revokeRefreshToken,
} from "./token/token.repository";

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies[env.refreshTokenCookieName];

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          message: "Refresh token is missing.",
        },
      });
      return;
    }

    const result = await refreshSession(refreshToken);

    res.cookie(env.refreshTokenCookieName, result.refreshToken, {
      httpOnly: true,
      secure: env.envNode === "production",
      sameSite: "lax",
      maxAge: env.refreshTokenCookieMaxAge,
      path: "/api/v1/auth",
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies[env.refreshTokenCookieName];

    if (!refreshToken) {
      res.status(204).send();
    }

    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const tokenRecord = await findRefreshTokenByHash(tokenHash);

    if (tokenRecord && !tokenRecord.revoked_at) {
      await revokeRefreshToken(tokenRecord.id);
    }
    res.clearCookie(env.refreshTokenCookieName, {
      httpOnly: true,
      secure: env.envNode === "production",
      sameSite: "lax",
      path: "/api/v1/auth",
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
