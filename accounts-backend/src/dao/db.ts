import { Sequelize } from "sequelize";
import * as dbConfig from "../utils/config";
import initAccount from "./Account";
import initStore from "./Store";
import Account from "./../model/Account";
import Store from "./../model/Store";
import Food from "./../model/Food";
import initFood from "./Food";

export async function initDB() {
    const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.USER_NAME, dbConfig.DB_PASSWORD, {
        host: dbConfig.DB_HOST,
        dialect: dbConfig.DB_TYPE,
        pool: {
            max: 20,
            min: 1,
        },
        define: {
            charset: 'utf8',
        }
    });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    initAccount(sequelize);
    initStore(sequelize);
    initFood(sequelize);

    Account.hasOne(Store)
    Store.belongsTo(Account);

    Store.hasMany(Food);
    Food.belongsTo(Store);

    await sequelize.sync();
}


  