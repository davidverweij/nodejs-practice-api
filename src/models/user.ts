import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from "sequelize";

import { Group } from "./group";

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: "is_deleted" }>
> {
  declare id: CreationOptional<string>;

  declare login: string;

  declare password: string;

  declare age: number;

  declare is_deleted: boolean;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `User.init` was called.
  declare getGroups: HasManyGetAssociationsMixin<Group>;

  declare addGroup: HasManyAddAssociationMixin<Group, number>;

  declare addGroups: HasManyAddAssociationsMixin<Group, number>;

  declare setGroups: HasManySetAssociationsMixin<Group, number>;

  declare removeGroup: HasManyRemoveAssociationMixin<Group, number>;

  declare removeGroups: HasManyRemoveAssociationsMixin<Group, number>;

  declare hasGroup: HasManyHasAssociationMixin<Group, number>;

  declare hasGroups: HasManyHasAssociationsMixin<Group, number>;

  declare countGroups: HasManyCountAssociationsMixin;

  /**
   * Initializes the ORM with the imported User Model
   *
   * @param {Sequelize} sequelize
   */
  static initModel = (sequelize: Sequelize) => {
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
  };
}

export default User;
