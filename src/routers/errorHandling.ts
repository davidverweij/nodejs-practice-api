import express from "express";

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

export default errorRoute;
