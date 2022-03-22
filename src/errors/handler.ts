import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorLogger } from "../config";
import { sequelize } from "../data-access";
import BaseError from "./base";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // don't respond if error occured after response had been sent
  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(
    err instanceof BaseError ? err.httpCode : StatusCodes.INTERNAL_SERVER_ERROR
  );
  res.json({ error: err.message });
};

// Catch unhandled rejection (Programming error)
process.on("unhandledRejection", (error: Error) => {
  throw error;
});

// Catch uncaught exceptions (might be Programming OR Operational error)
process.on("uncaughtException", async (error: Error) => {
  // report
  errorLogger.error("uncaughtException", error);
  // close instances/connections
  await sequelize.close();
  // exit 'gracefully'
  process.exit(1);
});

export default errorHandler;
