const { Model } = require("sequelize")

class Food extends Model {
  id
  storeId
  name
  imgPath
  price
  cuisine
  flavor
  soldOut
  deleted
  createdAt
  updatedAt
}

module.exports = Food