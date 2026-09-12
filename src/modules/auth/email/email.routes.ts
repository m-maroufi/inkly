import { Router } from "express";
import { registerWithEmailController } from "./email.controller";

export const emailRouter = Router();

emailRouter.post("/register", registerWithEmailController);
