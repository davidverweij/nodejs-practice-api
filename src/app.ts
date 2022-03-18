import express from "express";
import cors from "cors";

// wraps express routers to auto-catch async errors
import "express-async-errors";

import { passport } from "./services/auth";
import {
  userRoute,
  groupRoute,
  notFoundRoute,
  errorRoute,
  authRoute,
} from "./routers";
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
  app.use(
    // auto-enables CORS, and pre-flight
    cors({
      origin: "https://www.test-cors.org",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );

  // before middleware
  app.use(timingMiddlewareBefore); // start time measurement - will be printed in logs
  app.use(loggerMiddleware);
  app.use(express.json());
  app.use(passport.initialize());

  // routes
  app.use("/login", authRoute);
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
