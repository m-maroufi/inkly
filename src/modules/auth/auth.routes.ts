import { Router } from "express";
import { emailRouter } from "./email/email.routes";
import { refreshTokenController, logoutController } from "./auth.controller";

export const authRouter = Router();

authRouter.use("/email", emailRouter);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);
