import axios from "axios";
import { ApiResponse, EmployeeSex } from "../utils/constants";

const apiCreateEmployee = "/employee/create"
export const createEmployee = (data) => {
  return axios.post(apiCreateEmployee, data)
}

const apiGetEmployee = "/employee/:employeeId"
export const getEmployee = (param) => {
  return axios.get(apiGetEmployee.replace(":employeeId", param.employeeId))
}

const apiUpdateEmployee = "/employee/:employeeId"
export const updateEmployee = (param, data) => {
  return axios.put(apiUpdateEmployee.replace(":employeeId", param.employeeId), data)
}

const apiGetEmployeeList = "/employee/list"
export const getEmployeeList = ()=> {
  return axios.get(apiGetEmployeeList)
}

const apiDeleteEmployeeList = "/employee/delete"
export const deleteEmployee = (data) => {
  return axios.delete(apiDeleteEmployeeList, {
    data
  })
}

