const express = require("express");
const { JWT_SCRECT } = require("../../utils/config");
const Account = require("../../model/Account");
const Employee = require("../../model/Employee");
const API_CODES = require("../../utils/API_CODES");
const { generateResponse } = require("../../utils");
const jwt = require("jsonwebtoken");

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const token = req.query.token
    const jwtToken = jwt.verify(token, JWT_SCRECT);

    const account = await Account.findOne({
      where: {
        token: jwtToken.token,
      },
    });

    if (!account) {
      throw new Error();
    }

    const employee = await Employee.findOne({
      where: {
        accountId: account.dataValues.id
      }
    })

    if (!employee) {
      throw new Error();
    }

    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        token: token,
        bussinessId: employee.dataValues.id
      }
    ))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
