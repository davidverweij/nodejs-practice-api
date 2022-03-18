import express from "express";

// wraps express routers to auto-catch async errors
import "express-async-errors";

import { userRoute, groupRoute, notFoundRoute, errorRoute } from "./routers";
import { setupDatabase } from "./data-access";
import {
  loggerMiddleware,
  errorLoggerMiddleware,
  timingMiddlewareBefore,
} from "./config/logger";
import { errorHandler } from "./errors";

const start = async (): Promise<void> => {
  // Prerequisites
  await setupDatabase();

  const app = express();
  const port = 3000;

  app.disable("x-powered-by");

  // before middleware
  app.use(timingMiddlewareBefore); // start time measurement - will be printed in logs
  app.use(loggerMiddleware);
  app.use(express.json());

  // routes
  app.use("/user", userRoute);
  app.use("/group", groupRoute);

  // NOTE: For testing, will be moved to testing setup
  app.use("/error", errorRoute);

  // catch non-existing routes
  app.use(notFoundRoute);

  // after middleware
  app.use(errorLoggerMiddleware);

  // custom error handler
  // after middleware
  app.use(errorHandler);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on localhost:${port}`);
  });
  // app.use(timingMiddleware); // finish time measurement and log
};

start();
