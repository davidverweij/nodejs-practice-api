import { Transaction } from "sequelize";
import { Group, User } from "../models";
import { sequelize } from "../data-access";
import { NotFoundError } from "../errors";

class UserGroupService {
  static async addManyToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<void> {
    // find group
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new NotFoundError(`Group '${groupId}' not found.`);
    }

    // find users. Rolls back if any don't exist
    return sequelize.transaction(async (transaction: Transaction) => {
      const userUpdates = userIds.map(async (userId) => {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
          throw new NotFoundError(`User '${userId}' not found.`);
        }
        return user.addGroup(group);
      });

      await Promise.all(userUpdates);
    });
  }
}

export default UserGroupService;
