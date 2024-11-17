import axios from "axios"

const apiRegister = "/auth/register"
export const register = (data) => {
  return axios.post(apiRegister, data)
}

const apiLogin = "/auth/login"
export const login = (data) => {
  return axios.post(apiLogin, data)
}
