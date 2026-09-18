import { z } from "zod";
import {
  emailLoginSchema,
  emailRegisterSchema,
  emailVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./email.schema";

export type EmailRegisterInput = z.infer<typeof emailRegisterSchema>;

export type EmailVerifyInput = z.infer<typeof emailVerifySchema>;

export type EmailLoginInput = z.infer<typeof emailLoginSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
