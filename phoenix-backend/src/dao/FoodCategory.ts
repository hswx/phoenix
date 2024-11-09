import { DataTypes, Sequelize } from "sequelize";
import FoodCategory from "../model/FoodCategory";
import Store from "./../model/Store";
import Food from "./../model/Food";
import Category from "./../model/Category";

const initFoodCategory = function (sequelize: Sequelize) {
  FoodCategory.init(
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
      foodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Food,
          key: "id"
        }
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Category,
          key: "id"
        }
      }
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "food_categories",
    }
  );
};

export default initFoodCategory;
