const express = require("express");
const { initDB } = require("./src/dao/db");
const {
  ELECTRON_FRONTEND_HOST,
  MOBILE_FRONETNE_HOST,
  JWT_SCRECT,
} = require("./src/utils/config");
const jwt = require("jsonwebtoken");
const Account = require("./src/model/Account");
const { ROLE } = require("./src/utils/constants");
const Store = require("./src/model/Store");
const Employee = require("./src/model/Employee");
const authRouter = require("./src/routes/auth");
const storeRouter = require("./src/routes/store");
const foodRouter = require("./src/routes/food");
const categoryRouter = require("./src/routes/category");
const employeeRouter = require("./src/routes/employee");
const mobileRouter = require("./src/routes/mobile");

(async () => {
  await initDB();
})();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    origin &&
    [ELECTRON_FRONTEND_HOST, MOBILE_FRONETNE_HOST].includes(origin)
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", [
      "POST",
      "GET",
      "PUT",
      "DELETE",
      "PATCH",
    ]);
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
  const regexp = /^\/auth(\/\S)*/;
  const mobileRegexp = /^\/mobile\/auth(\/\S)*/;

  if (regexp.test(req.url) || mobileRegexp.test(req.url)) {
    next();
    return;
  }

  try {
    const authorizationToken = req.headers.authorization?.split(" ")[1];
    const bussinessId = req.headers["bussiness-id"];
    if (!authorizationToken || !bussinessId) {
      throw new Error();
    }

    const jwtToken = jwt.verify(authorizationToken, JWT_SCRECT);

    const account = await Account.findOne({
      where: {
        token: jwtToken.token,
      },
    });

    if (!account) {
      throw new Error();
    }

    
    const accountRole = account.dataValues.role;
    const accountId = account.dataValues.id;

    req.body.accountId = accountId;

    if (accountRole === ROLE.STORE_MANAGER) {
      const store = await Store.findOne({
        where: {
          id: bussinessId,
          accountId: accountId,
        },
      });
      if (!store) {
        throw new Error();
      }
      req.body.storeId = store.dataValues.id;
    } else if (accountRole === ROLE.EMPLOYEE) {
      const employee = await Employee.findOne({
        where: {
          id: bussinessId,
          accountId: accountId,
        },
      });
      if (!employee) {
        throw new Error();
      }
      req.body.employeeId = employee.dataValues.id;
    } else {
      throw new Error();
    }
    next();
  } catch {
    res.sendStatus(401);
  }
});

app.use("/auth", authRouter);
app.use("/store", storeRouter);
app.use("/food", foodRouter);
app.use("/category", categoryRouter);
app.use("/employee", employeeRouter);
app.use("/mobile", mobileRouter);

module.exports = app;