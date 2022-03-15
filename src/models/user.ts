import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: "is_deleted" }>
> {
  declare id: CreationOptional<string>;

  declare login: string;

  declare password: string;

  declare age: number;

  declare is_deleted: boolean;

  /**
   * Initializes the ORM with the imported User Model
   *
   * @param {Sequelize} sequelize
   */
  static initUserModel = (sequelize: Sequelize) => {
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
