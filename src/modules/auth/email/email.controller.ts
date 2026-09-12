import { NextFunction, Request, Response } from "express";
import { emailRegisterSchema } from "./email.schema";
import { registerWithEmail } from "./email.service";

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
