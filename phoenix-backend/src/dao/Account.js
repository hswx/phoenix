const Account = require("../model/Account");
const { DataTypes } = require("sequelize");
const { encodeWithHash } = require("../utils");

const initAccount = (sequelize) => {
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
        set(value) {
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

module.exports = initAccount

