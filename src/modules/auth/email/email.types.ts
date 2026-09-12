import { z } from "zod";
import { emailRegisterSchema, emailVerifySchema } from "./email.schema";

export type EmailRegisterInput = z.infer<typeof emailRegisterSchema>;

export type EmailVerifyInput = z.infer<typeof emailVerifySchema>;
