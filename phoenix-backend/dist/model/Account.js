"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Account extends sequelize_1.Model {
    id;
    telephone;
    password;
    token;
    createdAt;
    updatedAt;
}
exports.default = Account;
