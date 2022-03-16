import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorLogger } from "../config";
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
process.on("uncaughtException", (error: Error) => {
  errorLogger.error("uncaughtException", error);
  process.exit(1);
});

export default errorHandler;
