import winston from "winston";
import expressWinston from "express-winston";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const logMessage = (req: Request, res: Response) =>
  `${res.statusCode} ${req.method} ${req.url}`;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YY-MM-DD HH:MM:SS",
        }),
        winston.format.printf(
          (info) => `${info.timestamp}  ${info.level} : ${info.message}`
        )
      ),
    }),
    new winston.transports.File({
      level: "info",
      filename: `./logs/info.log`,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YY-MM-DD HH:MM:SS",
        }),
        winston.format.json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: `./logs/error.log`,
      format: winston.format.json(),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

const loggerMiddleware = expressWinston.logger({
  winstonInstance: logger,
  // override default express logger message
  msg: logMessage,
});

const errorLoggerMiddleware = expressWinston.errorLogger({
  winstonInstance: errorLogger,
});

/**
 * Catch any unhandled errors
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // don't respond if error occured after response had been sent
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({ error: err.message });
};

process.on("uncaughtException", (error) => {
  errorLogger.error(`${error.name} : ${error.message} : ${error.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  const message =
    error instanceof Error
      ? `${error.name} : ${error.message} : ${error.stack}`
      : `Unhandled Promise Reject : ${error}`;
  errorLogger.error(message);
  process.exit(1);
});

export { loggerMiddleware, errorLoggerMiddleware, errorHandler };
