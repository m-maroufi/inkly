import { NextFunction, Request, Response } from "express";
import {
  emailLoginSchema,
  emailRegisterSchema,
  emailVerifySchema,
} from "./email.schema";
import {
  loginWithEmail,
  registerWithEmail,
  verifyEmail,
} from "./email.service";
import { env } from "../../../config/env";

export async function registerWithEmailController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = emailRegisterSchema.parse(req.body);
    const user = await registerWithEmail(data);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = emailVerifySchema.parse(req.body);

    const user = await verifyEmail(data.token);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginWithEmailController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = emailLoginSchema.parse(req.body);
    const result = await loginWithEmail(data);

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
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
