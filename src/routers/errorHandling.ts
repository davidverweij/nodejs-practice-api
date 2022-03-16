import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../errors";

const errorRoute = express.Router();

errorRoute.get("/throw", () => {
  throw new Error("Throwing error in route!");
});

errorRoute.get("/reject1", () => Promise.reject());

errorRoute.get("/reject2", () =>
  // eslint-disable-next-line prefer-promise-reject-errors
  Promise.reject("Reject with message")
);

errorRoute.get("/reject3", async () =>
  Promise.reject(new Error("Reject with Error"))
);

errorRoute.get(
  "/timeout",
  (_req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(2000, () => {
      next(
        new BaseError(
          "TimeoutError",
          StatusCodes.REQUEST_TIMEOUT,
          "Response timed out"
        )
      );
    });
    // wait forever..
    return new Promise(() => {});
  }
);

export default errorRoute;
