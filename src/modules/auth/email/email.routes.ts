import { Router } from "express";
import {
  registerWithEmailController,
  verifyEmailController,
  loginWithEmailController,
  verifyEmailFromLinkController,
} from "./email.controller";

export const emailRouter = Router();

emailRouter.post("/register", registerWithEmailController);

emailRouter.post("/verify", verifyEmailController);
emailRouter.get("/verify", verifyEmailFromLinkController);
emailRouter.post("/login", loginWithEmailController);
