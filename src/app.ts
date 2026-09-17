import express from "express";
import cookieParser from "cookie-parser";
import { apiV1Router } from "./routes";
import { notFoundMiddlware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use("/api/v1", apiV1Router);

  app.use(notFoundMiddlware);
  // error middleware
  app.use(errorMiddleware);
  return app;
}
