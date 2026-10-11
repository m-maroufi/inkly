import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { refreshSession } from "./token/token.session.service";
import { createHash } from "node:crypto";
import {
  findRefreshTokenByHash,
  revokeRefreshToken,
} from "./token/token.repository";
import { AuthenticationError } from "../../shared/errors/authentication-error";
import { findUserById } from "./email/email.repository";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { toPublicUser } from "../../shared/utils/user";
import { revokeAccessToken } from "./token/token.service";

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
    const authorization = req.headers.authorization;

    // 1. Revoke the refresh token, if present.
    if (refreshToken) {
      const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

      const tokenRecord = await findRefreshTokenByHash(tokenHash);

      if (tokenRecord && !tokenRecord.revoked_at) {
        await revokeRefreshToken(tokenRecord.id);
      }
    }

    // 2. Revoke the access token, if supplied.
    if (authorization) {
      const [scheme, token, ...extraParts] = authorization.split(" ");

      if (scheme !== "Bearer" || !token || extraParts.length > 0) {
        throw new AuthenticationError("Invalid authorization header.");
      }

      await revokeAccessToken(token);
    }

    // 3. Clear the refresh-token cookie.
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

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required.");
    }
    const user = await findUserById(req.user.id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    res.status(200).json({
      success: true,
      data: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
}
