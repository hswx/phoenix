"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./../express.d.ts" />
const express_1 = __importDefault(require("express"));
const db_1 = require("./dao/db");
const auth_1 = __importDefault(require("./routes/auth"));
var cookieParser = require("cookie-parser");
(async () => {
    await (0, db_1.initDB)();
})();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    }
    else {
        next();
    }
});
app.use((req, res, next) => {
    res.sendResponse = () => {
        // const response: ApiResponse<T> = {
        //     status: error ? 'error' : 'success',
        //     message: message || (error ? 'An error occurred' : 'Request successful'),
        //     data,
        //     error,
        // };
        // res.status(statusCode).json(response);
    };
    next(); // 继续处理请求
});
app.use("/auth", auth_1.default);
module.exports = app;
