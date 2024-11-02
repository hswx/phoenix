"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Account_1 = __importDefault(require("./../model/Account"));
const crypto_1 = require("./../utils/crypto");
const initAccount = function (sequelize) {
    Account_1.default.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        telephone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('password', (0, crypto_1.encodeWithHash)(value));
            }
        },
        token: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
        },
    }, {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: "account",
    });
};
exports.default = initAccount;
