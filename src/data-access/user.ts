import { Sequelize, DataTypes } from "sequelize";
import { User } from "../models";

export { User as UserModel, authenticateDatabase };

const sequelize = new Sequelize("postgres", "localhost", "password", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "users",
  }
);

/**
 * Opens a connection with PostgreSQL, failes if authentication fails.
 *
 * @return {Promise<boolean>} True is OK to go, false if not
 */
const authenticateDatabase = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    // TODO: handle/report error
    return false;
  }
};
