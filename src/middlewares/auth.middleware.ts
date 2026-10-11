import type { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../shared/errors/authentication-error";
import {
  isAccessTokenRevoked,
  isAccessTokenVersionCurrent,
  verifyAccessToken,
} from "../modules/auth/token/token.service";
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AuthenticationError("Authentication required.");
    }
    const [scheme, token, ...extraParts] = authorization.split(" ");

    if (scheme !== "Bearer" || !token || extraParts.length > 0) {
      throw new AuthenticationError("Invalid authorization header.");
    }

    const payload = await verifyAccessToken(token);

    const isRevoked = await isAccessTokenRevoked(token);

    if (isRevoked) {
      throw new AuthenticationError("Access token has been revoked.");
    }
    const isVersionCurrent = await isAccessTokenVersionCurrent(
      payload.sub,
      payload.ver,
    );

    if (!isVersionCurrent) {
      throw new AuthenticationError("Access token is no longer valid.");
    }

    
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
