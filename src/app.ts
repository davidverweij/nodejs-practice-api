import express from "express";

import { userRoute } from "./routers";
import { authenticateDatabase } from "./data-access";

async function start(): Promise<void> {
  // Prerequisites
  if (!(await authenticateDatabase())) {
    // eslint-disable-next-line no-console
    console.log(
      "Connection with PostgreSQL failed. Please check that your DB is running and have access."
    );
    return;
  }

  const app = express();
  const port = 3000;

  app.disable("x-powered-by");
  app.use(express.json());
  app.use("/user", userRoute);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on localhost:${port}`);
  });
}

start();
