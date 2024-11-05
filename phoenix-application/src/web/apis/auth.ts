import axios, { AxiosResponse } from "axios"
import { ApiResponse } from "../utils/constants";
import API_CODES from "../utils/API_CODES";

const apiRegister = "/auth/register"
type registerRequestBody = {
  userName: string;
  telephoneNumber: string;
  password: string;
  storeName: string;
  storeAddress: string;
}
export const register = (data: registerRequestBody): Promise<ApiResponse> => {
  return axios.post(apiRegister, data)
}

const apiLogin = "/auth/login"
type loginRequestBody = {
  telephoneNumber: string;
  password: string;
}
type loginResponse = {
  token: string
}
export const login = (data: loginRequestBody): Promise<ApiResponse<loginResponse>> => {
  return axios.post(apiLogin, data)
}