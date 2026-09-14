import { z } from "zod";
import {
  emailLoginSchema,
  emailRegisterSchema,
  emailVerifySchema,
} from "./email.schema";

export type EmailRegisterInput = z.infer<typeof emailRegisterSchema>;

export type EmailVerifyInput = z.infer<typeof emailVerifySchema>;

export type EmailLoginInput = z.infer<typeof emailLoginSchema>;
