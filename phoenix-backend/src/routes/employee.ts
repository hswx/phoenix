import express from 'express';
import API_CODES from '../utils/API_CODES';
import { commonResponse, generateResponse } from '../utils';
import { Op } from 'sequelize';
import Employee, { EmployeeSex } from '../model/Employee';
import { GOOGLE_CLIENT, GOOGLE_ENTERPRISE_ID } from './../utils/config';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

const router = express.Router();

type getEmployeeListRequestQuery = {
  storeId: string;
}
type getEmployeeListResponseBody = {
  id: string;
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: number;
  qrCode: string;
  deleted: boolean;
  createdAt: number;
}[]
router.get<string, undefined, commonResponse<getEmployeeListResponseBody>, undefined, getEmployeeListRequestQuery>("/list", async function(req, res) {
  const storeId = req.query.storeId
  const employeeList = await Employee.findAll({
    where: {
      storeId,
      deleted: false,
    },
    order: [['createdAt', 'DESC']]
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
        telephoneNumber: data.telephoneNumber,
        employTime: data.employTime?.valueOf() || 0,
        qrCode: data.qrCode,
        deleted: data.deleted,
        createdAt: data.createdAt?.valueOf() || 0,
      }
    })
  ))
})

type createEmployeeRequestQuery = {
  storeId: string;
}
type createEmployeeRequestBody = {
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: Date;
}
router.post<string, undefined, commonResponse, createEmployeeRequestBody, createEmployeeRequestQuery>("/create", async function(req, res) {
  const storeId = req.query.storeId
  const body = req.body

  await GOOGLE_CLIENT.authorize()
  const androidmanagement = google.androidmanagement({
      version: 'v1',
      auth: GOOGLE_CLIENT,
  });

  const etCreateRes = await androidmanagement.enterprises.enrollmentTokens.create({
    parent: GOOGLE_ENTERPRISE_ID,
    requestBody: {
      policyName: randomUUID(),
      duration: "9999-12-31T23:59:59.999999999Z"
    }
  })

  const qrCode = etCreateRes.data.qrCode || ""
  
  const employee = new Employee({
    storeId,
    name: body.name,
    age: body.age,
    sex: body.sex,
    telephoneNumber: body.telephoneNumber,
    qrCode,
    employTime: body.employTime,
  })

  await employee.save()
  
  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

type getEmployeeRequestParam = {
  employeeId: string;
}
type getEmployeeRequestQuery = {
  storeId: string;
}
type getEmployeeResponse = {
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: number;
}
router.get<string, getEmployeeRequestParam, commonResponse<getEmployeeResponse>, undefined, getEmployeeRequestQuery>("/:employeeId", async function(req, res) {
  const employeeId = req.params.employeeId
  const storeId = req.query.storeId
  const employee = await Employee.findOne({
    where: {
      id: employeeId,
      storeId,
      deleted: false,
    }
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
      telephoneNumber: employeeData.telephoneNumber,
      employTime: employeeData.employTime.valueOf() || 0,
    }
  ))
})


type updateEmployeeRequestParam = {
  employeeId: string;
}
type updateEmployeeRequestQuery = {
  storeId: string;
}
type updateEmployeeRequestBody = {
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: Date;
}
router.put<string, updateEmployeeRequestParam, commonResponse, updateEmployeeRequestBody, updateEmployeeRequestQuery>("/:employeeId", async function(req, res) {
  const employeeId = req.params.employeeId
  const storeId = req.query.storeId
  const body = req.body
  const employee = await Employee.findOne({
    where: {
      id: employeeId,
      storeId,
    }
  })
  if (!employee) {
    throw new Error();
  }
  
  employee.set("name", body.name)
  employee.set("age", body.age)
  employee.set("sex", body.sex)
  employee.set("telephoneNumber", body.telephoneNumber)
  employee.set("employTime", body.employTime)

  await employee.save()

  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

type deleteEmployeeRequestQuery = {
  storeId: string;
}
type deleteEmployeeRequestBody = {
  employeeIds: string[];
}
router.delete<string, undefined, commonResponse, deleteEmployeeRequestBody, deleteEmployeeRequestQuery>("/delete", async function (req, res) {
  const storeId = req.query.storeId
  const employeeIds = req.body.employeeIds
  const employeeList = await Employee.findAll({
    where: {
      storeId,
      deleted: false,
      id: {
        [Op.in]: employeeIds
      }
    },
  })
  Promise.all(employeeList.map(item => item.set("deleted", true).save()))
  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

export default router;
