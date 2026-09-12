import { NextFunction, Request, Response } from "express";
import { emailRegisterSchema, emailVerifySchema } from "./email.schema";
import { registerWithEmail, verifyEmail } from "./email.service";

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
