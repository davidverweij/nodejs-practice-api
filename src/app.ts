import express from "express";

import { userRoute, groupRoute } from "./routers";
import { setupDatabase } from "./data-access";

const start = async (): Promise<void> => {
  // Prerequisites
  await setupDatabase();

  const app = express();
  const port = 3000;

  app.disable("x-powered-by");
  app.use(express.json());
  app.use("/user", userRoute);
  app.use("/group", groupRoute);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on localhost:${port}`);
  });
};

start();
