const { DataTypes } = require("sequelize");
const Account = require("../model/Account");
const Store = require("../model/Store");
const Employee = require("../model/Employee");

const initEmployee = (sequelize) => {
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Account,
          key: 'id'
        }
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Store,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sex: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      qrCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "employees",
    }
  );
};

module.exports = initEmployee;
