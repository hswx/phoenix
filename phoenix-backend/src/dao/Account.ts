import { DataTypes, Sequelize } from "sequelize";
import Account from "./../model/Account";
import { encodeWithHash } from "./../utils/crypto";

const initAccount = function (sequelize: Sequelize) {
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value: string) {
          this.setDataValue('password', encodeWithHash(value));
        }
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "accounts",
    }
  );
};

export default initAccount;
