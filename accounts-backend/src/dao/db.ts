import { DataTypes, Sequelize } from "sequelize";
import * as dbConfig from "./config";
import initAccount from "./Account";

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
    

    await sequelize.sync();
}


  