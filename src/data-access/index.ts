import { Sequelize } from "sequelize";
import { DatabaseConfig, User } from "../models";

/**
 * Opens a connection with PostgreSQL, failes if authentication fails.
 *
 * @return {Promise<void>} Errors if something goes wrong
 */
const setupDatabase = async ({
  name,
  user,
  password,
  host,
  port,
}: DatabaseConfig): Promise<void> => {
  try {
    // create connection
    const sequelize = new Sequelize(name, user, password, {
      host,
      port,
      dialect: "postgres",
    });
    // authenticate
    await sequelize.authenticate();
    // initialise ORM
    User.initUserModel(sequelize);
  } catch (error) {
    throw new Error("Database connection failed.");
  }
};

export default setupDatabase;
