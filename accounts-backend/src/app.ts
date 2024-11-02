import express from "express";
import { initDB } from "./dao/db";
import authRouter from "./routes/auth";
import API_CODES from "./utils/API_CODES";

var cookieParser = require("cookie-parser");

(async () => {
  await initDB();
})();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

declare global {
  namespace Express {
    interface Response {
      sendResponse<T>(
        code: API_CODES,
        data?: T,
        message?: string,
      ): Response;
    }
  }
}
app.use((req, res, next) => {
  res.sendResponse = <T>(code: API_CODES, data?: T, message?: string) => {
    const responseBody = {
        code,
        data,
        message: code === API_CODES.SUCCESS ? "Success": message
    }
    return res.status(200).json(responseBody);
  };
  next(); 
});

app.use("/auth", authRouter);

module.exports = app;
