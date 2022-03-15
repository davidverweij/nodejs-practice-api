import { Op } from "sequelize";

import { User } from "../models";

class UserService {
  /**
   * Gets all the users (Async). Skips 'deleted' users.
   * NOTE: Only used in development
   *
   * @return {Promise<User[]>} All users
   */
  static getAll(): Promise<User[]> {
    return User.findAll({});
  }

  /**
   * Gets the user by ID (Async). Skips 'deleted' users.
   *
   * @param {string} id
   * @return {Promise<User|null>} The found User or null if not found
   */
  static findByID(id: string): Promise<User | null> {
    return User.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["is_deleted"],
      },
    });
  }

  /**
   * Creates a user (Async)
   *
   * @param {string} login
   * @param {string} password
   * @param {number} age
   * @return {Promise<id>} the generated uuid from the new user
   */
  static async create(
    login: string,
    password: string,
    age: number
  ): Promise<string> {
    const user = await User.create({
      login,
      password,
      age,
    });
    return user.id;
  }

  /**
   * Updates a user (Async)
   *
   * @param {string} id
   * @param {string} login
   * @param {string} password
   * @param {number} age
   * @return {Promise<boolean>} success indicator
   */
  static async update(
    id: string,
    login: string,
    password: string,
    age: number
  ): Promise<boolean> {
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
  }

  /**
   * (Soft) deletes a user (Async)
   *
   * @param {string} id
   * @param {number} age
   * @return {Promise<boolean>} success indicator
   */
  static async delete(id: string): Promise<boolean> {
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
  }

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
  static async getAutoSuggest(
    loginSubstring: string,
    limit: number = -1
  ): Promise<User[]> {
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
  }
}

export default UserService;
