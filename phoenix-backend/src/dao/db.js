const { Sequelize } = require("sequelize");
const { DBCONFIG } = require("../utils/config");
const initAccount = require("./Account");
const initStore = require("./Store");
const initFood = require("./Food");
const initCategory = require("./Category");
const initFoodCategory = require("./FoodCategory");
const initEmployee = require("./Employee");
const initOrder = require("./Order");
const initOrderFood = require("./OrderFood");
const Account = require("../model/Account");
const Store = require("../model/Store");
const Employee = require("../model/Employee");
const Food = require("../model/Food");
const Category = require("../model/Category");
const FoodCategory = require("../model/FoodCategory");
const Order = require("../model/Order");
const OrderFood = require("../model/OrderFood");

const sequelize = new Sequelize(
  DBCONFIG.DB_NAME,
  DBCONFIG.USER_NAME,
  DBCONFIG.DB_PASSWORD,
  {
    host: DBCONFIG.DB_HOST,
    dialect: DBCONFIG.DB_TYPE,
    pool: {
      max: 20,
      min: 1,
    },
    define: {
      charset: "utf8",
    },
  }
);

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  initAccount(sequelize);
  initStore(sequelize);
  initFood(sequelize);
  initCategory(sequelize);
  initFoodCategory(sequelize);
  initEmployee(sequelize);
  initOrder(sequelize);
  initOrderFood(sequelize);
  
  Account.hasOne(Store);
  Store.belongsTo(Account);

  Store.hasMany(Food);
  Food.belongsTo(Store);
  Store.hasMany(Category);
  Category.belongsTo(Store);

  Category.hasMany(FoodCategory);
  FoodCategory.belongsTo(Category);

  Account.hasOne(Employee);
  Employee.belongsTo(Account);
  Store.hasMany(Employee);
  Employee.belongsTo(Store);

  Employee.hasMany(Order);
  Order.belongsTo(Employee);

  Order.hasMany(OrderFood);
  OrderFood.belongsTo(Order);

  // sequelize.sync({force: true})
}

module.exports = {
  sequelizeInstance: sequelize,
  initDB,
};
