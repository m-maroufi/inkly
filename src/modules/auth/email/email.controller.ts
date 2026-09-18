import { NextFunction, Request, Response } from "express";
import {
  emailLoginSchema,
  emailRegisterSchema,
  emailVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./email.schema";
import {
  loginWithEmail,
  registerWithEmail,
  verifyEmail,
  forgetPassword,
  resetPassword,
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

export async function verifyEmailFromLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.query.token;

    if (typeof token !== "string" || !token) {
      res.status(400).json({
        success: false,
        error: {
          message: "Verification token is required.",
        },
      });
      return;
    }

    await verifyEmail(token);

    res.redirect(`${env.frontendUrl}/email-verified`);
  } catch (error) {
    next(error);
  }
}

export async function forgotPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = forgotPasswordSchema.parse(req.body);

    await forgetPassword(input);

    res.status(200).json({
      success: true,
      data: {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = resetPasswordSchema.parse(req.body);

    await resetPassword(input);

    res.status(200).json({
      success: true,
      data: {
        message: "Password has been reset successfully.",
      },
    });
  } catch (error) {
    next(error);
  }
}
