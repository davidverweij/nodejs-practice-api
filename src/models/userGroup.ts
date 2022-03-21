import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from "sequelize";

class UserGroup extends Model<
  InferAttributes<UserGroup>,
  InferCreationAttributes<UserGroup>
> {
  /**
   * Initializes the ORM with the imported User Model
   *
   * @param {Sequelize} sequelize
   */
  static initModel = (sequelize: Sequelize) => {
    UserGroup.init(
      {},
      {
        sequelize,
        timestamps: false,
        tableName: "usergroup",
      }
    );
  };
}

export default UserGroup;
