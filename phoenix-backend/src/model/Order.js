const { Model } = require("sequelize")

class Order extends Model {
  id
  employeeId
  createdAt
  updatedAt
}

module.exports = Order
