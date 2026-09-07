// this is a index.ts file

import { Router } from "express";
import { healthRouter } from "./health.route";
import { categoryRouter } from "../modules/categories/category.routes";

export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);

apiV1Router.use("/categories", categoryRouter);
