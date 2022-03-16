import winston from "winston";
import expressWinston from "express-winston";
import { Request, Response } from "express";

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

export { loggerMiddleware, errorLoggerMiddleware, errorLogger };
