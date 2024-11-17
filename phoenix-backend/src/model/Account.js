const { Model } = require("sequelize")

class Account extends Model {
  id
  telephone
  password
  token
  role
  createdAt
  updatedAt
}

module.exports = Account
