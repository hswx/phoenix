const express = require('express');
const { generateResponse } = require('./../../utils');
const API_CODES = require('./../../utils/API_CODES');
const Store = require('./../../model/Store');
const Employee = require('../../model/Employee');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const body = req.body
    const employee = await Employee.findOne({
      where: {
        id: body.employeeId
      },
      include: {
        model: Store,
      },
    })
    if (!employee || !employee.store) {
      throw new Error()
    }
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        name: employee.store.dataValues.name,
        address: employee.store.dataValues.address,
      }
    ))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
