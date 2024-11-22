const express = require("express");
const API_CODES = require("../utils/API_CODES");
const { generateResponse } = require("../utils");
const { Op, UniqueConstraintError } = require("sequelize");
const Employee = require("../model/Employee");
const { GOOGLE_CLIENT, GOOGLE_ENROLLMENT_URL, GOOGLE_ENTERPRISE_ID, MOBILE_FRONETNE_HOST, JWT_SCRECT } = require('./../utils/config');
const { google } = require('googleapis');
const { randomUUID } = require('crypto');
const Account = require('../model/Account');
const { ROLE } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const body = req.body;
    const employeeList = await Employee.findAll({
      where: {
        storeId: body.storeId,
        deleted: false,
      },
      order: [['createdAt', 'DESC']],
      include: {
        model: Account,
        attributes: ['telephone'],
      },
    })
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      employeeList.map(item => {
        const data = item.dataValues;
        return {
          id: data.id,
          name: data.name,
          age: data.age,
          sex: data.sex,
          telephone: item.account.dataValues.telephone,
          qrCode: data.qrCode,
          deleted: data.deleted,
          createdAt: data.createdAt?.valueOf() || 0,
        }
      })
    ))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.post("/create", async (req, res) => {
  try {
    const body = req.body

    await GOOGLE_CLIENT.authorize()
    const androidmanagement = google.androidmanagement({
      version: 'v1',
      auth: GOOGLE_CLIENT,
    });
    const etCreateRes = await androidmanagement.enterprises.enrollmentTokens.create({
      parent: GOOGLE_ENTERPRISE_ID,
      requestBody: {
        allowPersonalUsage: "ALLOW_PERSONAL_USAGE_UNSPECIFIED",
        policyName: randomUUID(),
        duration: 60 * 60 * 24 * 365 + "s"
      }
    })

    const account = new Account({
      telephone: body.telephone,
      password: "",
      role: ROLE.EMPLOYEE,
    })
    await account.save();

    const token = jwt.sign(
      {
        token: account.dataValues.token
      },
      JWT_SCRECT
    )

    await androidmanagement.enterprises.policies.patch({
      name: `${GOOGLE_ENTERPRISE_ID}/policies/${etCreateRes.data.policyName}`,
      requestBody: {
        applications: [
          {
            packageName: "com.android.chrome",
            installType: "FORCE_INSTALLED",
            managedConfiguration: {
              HomepageLocation: MOBILE_FRONETNE_HOST + "/auth?token=" + token,
            }
          }
        ]
      }
    })

    const enrollmentUrl = GOOGLE_ENROLLMENT_URL + etCreateRes.data.value

    const employee = new Employee({
      storeId: body.storeId,
      accountId: account.dataValues.id,
      name: body.name,
      age: body.age,
      sex: body.sex,
      qrCode: enrollmentUrl,
    })
    await employee.save();

    res.status(200).send(generateResponse(API_CODES.SUCCESS, token))
    console.log("employee token", token);
  } catch (e) {
    if (e instanceof UniqueConstraintError && e.errors.find(item => item.path === "telephone")) {
      res.status(200).send(generateResponse(API_CODES.REGISTER_TELEPHONE_REPEAT, undefined, "手机号码已存在"))
    } else {
      res.status(200).send(generateResponse(API_CODES.Error))
    }
  }
})

router.get("/:employeeId", async (req, res) => {
  try {
    const body = req.body
    const employee = await Employee.findOne({
      where: {
        id: req.params.employeeId,
        storeId: body.storeId,
        deleted: false,
      },
      include: {
        model: Account,
        attributes: ['telephone'],
      },
    })
    if (!employee) {
      throw new Error()
    }
    const employeeData = employee.dataValues;
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        name: employeeData.name,
        age: employeeData.age,
        sex: employeeData.sex,
        telephone: employee.account.dataValues.telephone,
      }
    ))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.put("/:employeeId", async (req, res) => {
  try {
    const body = req.body
    const employee = await Employee.findOne({
      where: {
        id: req.params.employeeId,
        storeId: body.storeId,
      },
      include: {
        model: Account,
      },
    })
    if (!employee) {
      throw new Error();
    }
    employee.set("name", body.name)
    employee.set("age", body.age)
    employee.set("sex", body.sex)

    employee.account.set("telephone", body.telephone)

    await employee.save()
    await employee.account.save()

    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    if (e instanceof UniqueConstraintError && e.errors.find(item => item.path === "telephone")) {
      res.status(200).send(generateResponse(API_CODES.REGISTER_TELEPHONE_REPEAT, undefined, "手机号码已存在"))
    } else {
      res.status(200).send(generateResponse(API_CODES.Error))
    }
  }
})

router.delete("/delete", async (req, res) => {
  try {
    const body = req.body
    const employeeIds = req.body.employeeIds
    const employeeList = await Employee.findAll({
      where: {
        storeId: body.storeId,
        deleted: false,
        id: {
          [Op.in]: employeeIds
        }
      },
      include: {
        model: Account,
      },
    })
    await Promise.all(employeeList.map(item => Promise.all([
      item.set("deleted", true).save(),
      item.account.destroy(),
    ])))
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
