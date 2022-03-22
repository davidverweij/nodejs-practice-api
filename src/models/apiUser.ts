import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class ApiUser extends Model<
  InferAttributes<ApiUser>,
  InferCreationAttributes<ApiUser>
> {
  declare id: CreationOptional<string>;

  declare login: string;

  declare password: string;

  /**
   * Initializes the ORM with the imported User Model
   *
   * @param {Sequelize} sequelize
   */
  static initModel = (sequelize: Sequelize) => {
    ApiUser.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        login: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        tableName: "apiusers",
      }
    );
  };
}

export default ApiUser;
