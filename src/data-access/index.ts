import { Sequelize } from "sequelize";
import { Group } from "../models/group";
import User from "../models/user";
import UserGroup from "../models/userGroup";
import config from "../config";

// create db object
const sequelize = new Sequelize(config.name, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "postgres",
});

/**
 * Opens a connection with PostgreSQL, failes if authentication fails.
 *
 * @return {Promise<void>} Errors if something goes wrong
 */
const setupDatabase = async (): Promise<void> => {
  try {
    // authenticate
    await sequelize.authenticate();
    // initialise ORM
    User.initModel(sequelize);
    Group.initModel(sequelize);
    UserGroup.initModel(sequelize);
    User.belongsToMany(Group, {
      through: UserGroup,
      foreignKey: "user_id",
      otherKey: "group_id",
    });
    Group.belongsToMany(User, {
      through: UserGroup,
      foreignKey: "group_id",
      otherKey: "user_id",
    });
  } catch (error) {
    throw new Error("Database connection failed.");
  }
};

export { sequelize, setupDatabase };
