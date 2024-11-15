import { DataTypes, Sequelize } from "sequelize";
import Food, { Cuisine } from "../model/Food";
import Order from "../model/Order";
import OrderFood from "./../model/OrderFood";

const initOrderFood = function (sequelize: Sequelize) {
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
      foodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Food,
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
       defaultValue: Cuisine.UNKNOWN,
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

export default initOrderFood;
