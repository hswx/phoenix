const { Model } = require("sequelize")

class Category extends Model {
  id
  storeId
  name
  query
  ruleType
  deleted
  createdAt
  updatedAt
}

module.exports = Category
