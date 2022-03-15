import { Group, GroupPermissions } from "../models";

class GroupService {
  /**
   * Gets all the groups (Async)
   * NOTE: Only used in development
   *
   * @return {Promise<UserModel[]>} All users
   */
  static all(): Promise<Group[]> {
    return Group.findAll({});
  }

  /**
   * Gets the group by ID (Async)
   *
   * @param {string} id
   * @return {Promise<Group|null>} The found User or null if not found
   */
  static findByID(id: string): Promise<Group | null> {
    return Group.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Creates a group (Async)
   *
   * @param {string} name
   * @param {Array<GroupPermissions} permissions
   * @return {Promise<id>} the generated uuid from the new user
   */
  static async create(
    name: string,
    permissions: Array<GroupPermissions>
  ): Promise<string> {
    const user = await Group.create({
      name,
      permissions,
    });
    return user.id;
  }

  /**
   * Updates a group (Async)
   *
   * @param {string} id
   * @param {string} name
   * @param {Array<GroupPermissions} permissions
   * @return {Promise<boolean>} success indicator
   */
  static async update(
    id: string,
    name: string,
    permissions: Array<GroupPermissions>
  ): Promise<boolean> {
    const result = await Group.update(
      {
        name,
        permissions,
      },
      {
        where: {
          id,
        },
      }
    );
    return result[0] === 1; // one row in the table should be affected
  }

  /**
   * (Hard) deletes a group (Async)
   *
   * @param {string} id
   * @return {Promise<boolean>} success indicator
   */
  static async delete(id: string): Promise<boolean> {
    const result = await this.findByID(id);

    if (!result) {
      return false;
    }

    await result.destroy();
    return true;
  }
}

export default GroupService;
