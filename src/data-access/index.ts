import {
  Sequelize,
  Op,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export {
  findUserByID,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getAutoSuggestUsers,
  authenticateDatabase,
};

const sequelize = new Sequelize("postgres", "localhost", "password", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: "is_deleted" }>
> {
  declare id: CreationOptional<string>;

  declare login: string;

  declare password: string;

  declare age: number;

  declare is_deleted: boolean;
}

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

/**
 * Gets all the users (Async). Skips 'deleted' users.
 * NOTE: Only used in development
 *
 * @param {string} id
 * @return {Promise<User[]>} All users
 */
const getAllUsers = (): Promise<User[]> => User.findAll({});

/**
 * Gets the user by ID (Async). Skips 'deleted' users.
 *
 * @param {string} id
 * @return {Promise<User|null>} The found User or null if not found
 */
const findUserByID = (id: string): Promise<User | null> =>
  User.findOne({
    where: {
      id,
      is_deleted: false,
    },
    attributes: {
      exclude: ["is_deleted"],
    },
  });

/**
 * Creates a user (Async)
 *
 * @param {string} login
 * @param {string} password
 * @param {number} age
 * @return {Promise<id>} the generated uuid from the new user
 */
const createUser = async (
  login: string,
  password: string,
  age: number
): Promise<string> => {
  const user = await User.create({
    login,
    password,
    age,
  });
  return user.id;
};

/**
 * Updates a user (Async)
 *
 * @param {string} id
 * @param {string} login
 * @param {string} password
 * @param {number} age
 * @return {Promise<boolean>} success indicator
 */
const updateUser = async (
  id: string,
  login: string,
  password: string,
  age: number
): Promise<boolean> => {
  const result = await User.update(
    {
      login,
      password,
      age,
    },
    {
      where: {
        id,
        is_deleted: false,
      },
    }
  );
  return result[0] === 1; // one row in the table should be affected
};

/**
 * (Soft) deletes a user (Async)
 *
 * @param {string} id
 * @param {number} age
 * @return {Promise<boolean>} success indicator
 */
const deleteUser = async (id: string): Promise<boolean> => {
  const result = await User.update(
    {
      is_deleted: true,
    },
    {
      where: {
        id,
        is_deleted: false,
      },
    }
  );
  return result[0] === 1; // one row in the table should be affected
};

/**
 * Retrieve (undeleted) users based on a filter (Async)
 *
 * Assumes (from task) that limit is applied to the source,
 * not the result after searching
 *
 * @param {String} loginSubstring the substring to filter user logins with
 * @param {Number} [limit=-1] limiter for search results
 * @return {Promise<User[]>} list of users founds based on query
 */
const getAutoSuggestUsers = async (
  loginSubstring: string,
  limit: number = -1
): Promise<User[]> => {
  const searchLimit = limit > 0 ? limit : undefined;

  const users = await User.findAll({
    where: {
      login: {
        // case-insensitive substring 'search'
        [Op.iLike]: `%${loginSubstring}%`,
      },
      is_deleted: false,
    },
    order: [["login", "ASC"]],
    attributes: {
      exclude: ["is_deleted"],
    },
    limit: searchLimit,
  });

  return users;
};
