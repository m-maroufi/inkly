import type { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../shared/errors/authentication-error";
import { verifyAccessToken } from "../modules/auth/token/token.service";
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
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AuthenticationError("Invalid authorization header.");
    }
    const payload = await verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
