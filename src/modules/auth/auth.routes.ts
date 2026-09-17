import { Router } from "express";
import { emailRouter } from "./email/email.routes";
import { refreshTokenController } from "./auth.controller";

export const authRouter = Router();

authRouter.use("/email", emailRouter);
authRouter.post("/refresh", refreshTokenController);
