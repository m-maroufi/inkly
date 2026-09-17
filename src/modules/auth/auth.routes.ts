import { Router } from "express";
import { emailRouter } from "./email/email.routes";
import {
  refreshTokenController,
  logoutController,
  getCurrentUserController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.use("/email", emailRouter);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);

authRouter.get("/me", authMiddleware, getCurrentUserController);
