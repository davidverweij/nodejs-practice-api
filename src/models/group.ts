import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
} from "sequelize";

// type GroupPermissions = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES'
enum GroupPermissions {
  READ = "READ",
  WRITE = "WRITE",
  DELETE = "DELETE",
  SHARE = "SHARE",
  UPLOAD_FILES = "UPLOAD_FILES",
}

class Group extends Model<
  InferAttributes<Group>,
  InferCreationAttributes<Group>
> {
  declare id: CreationOptional<string>;

  declare name: string;

  declare permissions: Array<GroupPermissions>;

  /**
   * Initializes the ORM with the imported User Model
   *
   * @param {Sequelize} sequelize
   */
  static initModel = (sequelize: Sequelize) => {
    Group.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        permissions: {
          type: DataTypes.ARRAY(
            DataTypes.ENUM({ values: Object.values(GroupPermissions) })
          ),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: "groups",
      }
    );
  };
}

export { GroupPermissions, Group };
