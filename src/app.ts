import express from "express";

import { userRoute } from "./routers";
import setupDatabase from "./data-access";
import config from "./config";

const start = async (): Promise<void> => {
  // Prerequisites
  await setupDatabase(config);

  const app = express();
  const port = 3000;

  app.disable("x-powered-by");
  app.use(express.json());
  app.use("/user", userRoute);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on localhost:${port}`);
  });
};

start();
