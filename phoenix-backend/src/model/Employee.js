const { Model } = require("sequelize")

class Employee extends Model {
  id
  accountId
  storeId
  name
  age
  sex
  qrcode
  deleted
  createdAt
  updatedAt
}

module.exports = Employee