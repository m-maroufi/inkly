import { z } from "zod";
import { emailRegisterSchema } from "./email.schema";

export type EmailRegisterInput = z.infer<typeof emailRegisterSchema>;
