const { DataTypes } = require("sequelize");
const OrderFood = require("../model/OrderFood");
const Order = require("../model/Order");
const { CUISINE } = require("../utils/constants");

const initOrderFood = function (sequelize) {
  OrderFood.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Order,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgPath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cuisine: {
       type: DataTypes.INTEGER,
       allowNull: false,
       defaultValue: CUISINE.UNKNOWN,
      },
      flavor: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      modelName: "order_foods",
    }
  );
};

module.exports = initOrderFood;
