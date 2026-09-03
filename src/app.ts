import express from "express";
import { apiV1Router } from "./routes";
import { notFoundMiddlware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", apiV1Router);

  app.use(notFoundMiddlware);

  // error middleware
  app.use(errorMiddleware);
  return app;
}
