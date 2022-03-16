import winston from "winston";
import expressWinston from "express-winston";
import { Request } from "express";

const logMessage = (req: Request) => `${req.method} ${req.url}`;

const transportOptions = {
  file: {
    level: "info",
    filename: `./logs/app.log`,
    format: winston.format.json(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console(transportOptions.console),
    new winston.transports.File(transportOptions.file),
  ],
  // override default express logger message
  msg: logMessage,
  metaField: null,
  meta: false,
});

// const loggerStream = {
//   write: (message: string) => {
//     winstonLogger.info(message);
//   },
// };

// const loggingMiddleware = logger("combined", { stream: loggerStream });

export default logger;
