import { Sequelize } from "sequelize";
import * as dbConfig from "../utils/config";
import initAccount from "./Account";
import initStore from "./Store";
import Account from "./../model/Account";
import Store from "./../model/Store";
import Food from "./../model/Food";
import initFood from "./Food";
import initCategory from "./Category";
import initFoodCategory from "./FoodCategory";
import FoodCategory from "./../model/FoodCategory";
import Category from "./../model/Category";
import initEmployee from "./Employee";
import Employee from "./../model/Employee";
import initOrder from "./Order";
import Order from "./../model/Order";
import OrderFood from "./../model/OrderFood";
import initOrderFood from "./OrderFood";

const sequelize = new Sequelize(
    dbConfig.DB_NAME,
    dbConfig.USER_NAME,
    dbConfig.DB_PASSWORD,
    {
      host: dbConfig.DB_HOST,
      dialect: dbConfig.DB_TYPE,
      pool: {
        max: 20,
        min: 1,
      },
      define: {
        charset: "utf8",
      },
    }
);

export async function initDB() {
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

  Store.hasMany(FoodCategory);
  FoodCategory.belongsTo(Store);

  FoodCategory.hasMany(Food);
  Food.belongsTo(FoodCategory);
  FoodCategory.hasMany(Category);
  Food.belongsTo(FoodCategory);

  Store.hasMany(Employee);
  Employee.belongsTo(Store);

  Employee.hasMany(Order);
  Order.belongsTo(Employee);
  Order.hasMany(OrderFood);
  OrderFood.belongsTo(Order);

  // await sequelize.sync({force: true});
}

export default sequelize
