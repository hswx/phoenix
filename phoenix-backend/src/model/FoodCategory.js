const { Model } = require("sequelize")

class FoodCategory extends Model {
  id
  foodId
  categoryId
}

module.exports = FoodCategory
