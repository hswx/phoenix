const express = require("express");
const Account = require("../model/Account");
const { ROLE } = require("../utils/constants");
const Store = require("../model/Store");
const { generateResponse, encodeWithHash } = require("../utils");
const API_CODES = require("../utils/API_CODES");
const { UniqueConstraintError, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const { JWT_SCRECT } = require("../utils/config");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body
    const account = new Account({
      telephone: body.telephone,
      password: body.password,
      role: ROLE.STORE_MANAGER,
    })
    await account.save();
    const store = new Store({
      name: body.storeName,
      ownerName: body.userName,
      address: body.storeAddress,
      accountId: account.dataValues.id,
    })
    await store.save();
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    if (e instanceof UniqueConstraintError && e.errors.find(item => item.path === "telephone")) {
      res.status(200).send(generateResponse(API_CODES.REGISTER_TELEPHONE_REPEAT, undefined, "手机号码已存在"))
    } else {
      res.status(200).send(generateResponse(API_CODES.Error))
    }
  }
})

router.post("/login", async (req, res) => {
  const body = req.body;
  const account = await Account.findOne({
    where: {
      telephone: body.telephone,
      password: encodeWithHash(body.password),
    }
  })
  if (!account) {
    res.status(200).send(generateResponse(API_CODES.LOGIN_ACCOUNT_ERROR, undefined, '账号密码错误'))
    return
  }
  const store = await Store.findOne({
    where: {
      accountId: account.dataValues.id,
    }
  })
  if (!store) {
    res.status(200).send(generateResponse(API_CODES.STORE_UNFIND, undefined, '找不到门店'))
  }
  res.status(200).send(generateResponse(
    API_CODES.SUCCESS,
    {
      token: jwt.sign(
        {
          token: account.dataValues.token
        },
        JWT_SCRECT,
        {
          expiresIn: '100h',
        }),
      bussinessId: store.dataValues.id
    }
  ))
})

module.exports = router;