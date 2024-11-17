const { DataTypes } = require("sequelize");
const FoodCategory = require("../model/FoodCategory");
const Food = require("../model/Food");
const Category = require("../model/Category");

const initFoodCategory = function (sequelize) {
  FoodCategory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

module.exports = initFoodCategory;
