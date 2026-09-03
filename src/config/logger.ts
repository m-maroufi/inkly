import { pino } from "pino";
import { env } from "./env";

const loggerOptions = {
  level: env.logLevel ?? "info",
  base: {
    service: "inkly-api",
  },
  ...(env.envNode !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
};

export const logger = pino(loggerOptions);
