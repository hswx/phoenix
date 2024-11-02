import axios from "axios"
import { ApiResponse } from "../utils/constants";
import API_CODES from "../utils/API_CODES";

const apiRegister = "/auth/register"
type registerBody = {
  userName: string;
  telephoneNumber: string;
  password: string;
  storeName: string;
  storeAddress: string;
}
export const register = (data: registerBody) => {
  return axios.post<{}, ApiResponse, registerBody>(apiRegister, data)
}