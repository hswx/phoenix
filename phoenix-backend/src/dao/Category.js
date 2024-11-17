const { DataTypes } = require("sequelize");
const Category = require("../model/Category");
const Store = require("../model/Store");

const initCategory = function (sequelize) {
  Category.init(
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
      query: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ruleType: {
        type: DataTypes.INTEGER,
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
      modelName: "categories",
    }
  );
};

module.exports = initCategory;
