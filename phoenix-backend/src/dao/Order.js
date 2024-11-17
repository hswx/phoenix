const { DataTypes } = require("sequelize");
const Employee = require("../model/Employee");
const Order = require("../model/Order");


const initOrder = function (sequelize) {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Employee,
          key: 'id'
        }
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "orders",
    }
  );
};

module.exports = initOrder;
