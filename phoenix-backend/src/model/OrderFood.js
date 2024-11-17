const { Model } = require("sequelize")

class OrderFood extends Model {
  id
  orderId
  name
  imgPath
  price
  cuisine
  flavor
  count
  createdAt
  updatedAt
}

module.exports = OrderFood
