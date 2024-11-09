import express from "express";
import { initDB } from "./dao/db";
import authRouter from "./routes/auth";
import storeRouter from "./routes/store";
import jwt from "jsonwebtoken";
import { JWT_SCRECT } from "./utils/config";
import Account from "./model/Account";
import foodRouter from "./routes/food";
import categoryRouter from "./routes/category";

(async () => {
  await initDB();
})();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", ["POST", "GET", "PUT", "DELETE", "PATCH"])

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
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
app.use("/food", foodRouter);
app.use("/category", categoryRouter);

module.exports = app;
