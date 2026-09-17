import { Router } from "express";
import {
  registerWithEmailController,
  verifyEmailController,
  loginWithEmailController,
} from "./email.controller";

export const emailRouter = Router();

emailRouter.post("/register", registerWithEmailController);

emailRouter.post("/verify", verifyEmailController);

emailRouter.post("/login", loginWithEmailController);
