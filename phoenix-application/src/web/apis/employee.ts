import axios from "axios";
import { ApiResponse, EmployeeSex } from "../utils/constants";

const apiCreateEmployee = "/employee/create"
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
export const createEmployee = function(query: createEmployeeRequestQuery, data: createEmployeeRequestBody): Promise<ApiResponse> {
  return axios.post(apiCreateEmployee, data, {params: query})
}

const apiGetEmployee = "/employee/:employeeId"
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
  employTime: Date;
}
export const getEmployee = function(param: getEmployeeRequestParam, query: getEmployeeRequestQuery): Promise<ApiResponse<getEmployeeResponse>> {
  return axios.get(apiGetEmployee.replace(":employeeId", param.employeeId), {params: query})
}

const apiUpdateEmployee = "/employee/:employeeId"
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
export const updateEmployee = (param: updateEmployeeRequestParam, query: updateEmployeeRequestQuery, data: updateEmployeeRequestBody): Promise<ApiResponse> => {
  return axios.put(apiUpdateEmployee.replace(":employeeId", param.employeeId), data, {
    params: query
  })
}

const apiGetEmployeeList = "/employee/list"
type getEmployeeListRequestQuery = {
  storeId: string;
}
type getEmployeeListResponse = {
  id: string;
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: Date;
  createdAt: Date;
}[]
export const getEmployeeList = (query: getEmployeeListRequestQuery): Promise<ApiResponse<getEmployeeListResponse>> => {
  return axios.get(apiGetEmployeeList, {
    params: query
  })
}

const apiDeleteEmployeeList = "/employee/delete"
type deleteEmployeeListRequestQuery = {
  storeId: string;
}
type deleteEmployeeListRequestBody = {
  employeeIds: string[];
}
export const deleteEmployee = (query: deleteEmployeeListRequestQuery, data: deleteEmployeeListRequestBody): Promise<ApiResponse> => {
  return axios.delete(apiDeleteEmployeeList, {
    params: query,
    data
  })
}

