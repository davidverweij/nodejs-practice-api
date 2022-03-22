import { setupDatabase } from "./data-access";
import app from "./app";

const start = async (): Promise<void> => {
  await setupDatabase();
  app.listen(3000);
};

start();
