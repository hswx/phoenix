import express from "express";
import { initDB } from "./dao/db";
import authRouter from "./routes/auth";
import storeRouter from "./routes/store";
import API_CODES from "./utils/API_CODES";
import jwt from "jsonwebtoken";
import { JWT_SCRECT } from "./utils/config";
import Account from "./model/Account";

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
  res.setHeader("Access-Control-Allow-Methods", ["POST", "GET", "PUT", "DELETE"])

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

app.use(async (req, res, next) => {
  const regexp = /^\/auth\/\S+/;
  if (regexp.test(req.url)) {
    next()
    return
  } else {
    const authorizationToken = req.headers.authorization?.split(' ')[1];
    if (authorizationToken) {
      try {
        const jwtToken = jwt.verify(authorizationToken, JWT_SCRECT) as jwt.JwtPayload
        const account = await Account.findOne({
          where: {
            token: jwtToken.token
          }
        })
        if (account) {
          req.body.accountId = account.dataValues.id;
          next()
          return
        }
      } catch (e) {}
    }
  }
  res.sendStatus(401)
})

app.use("/auth", authRouter);
app.use("/store", storeRouter);

module.exports = app;
