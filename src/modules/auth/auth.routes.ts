import { Router } from "express";
import { emailRouter } from "./email/email.routes";

export const authRouter = Router();

authRouter.use("/email", emailRouter);
