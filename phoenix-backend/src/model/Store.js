const { Model } = require("sequelize")

class Store extends Model {
  id
  accountId
  name
  address
  ownerName
  createdAt
  updatedAt
}

module.exports = Store