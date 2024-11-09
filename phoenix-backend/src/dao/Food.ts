import { DataTypes, Sequelize } from "sequelize";
import Food, { Cuisine } from "./../model/Food";
import Store from "./../model/Store";

const initFood = function (sequelize: Sequelize) {
  Food.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      soldOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "foods",
    }
  );
};

export default initFood;
