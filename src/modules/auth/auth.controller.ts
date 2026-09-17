import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { refreshSession } from "./token/token.session.service";

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
