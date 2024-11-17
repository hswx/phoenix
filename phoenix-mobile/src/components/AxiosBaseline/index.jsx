import React from "react"
import axios, { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { BACKEND_HOST, BUSINESS_ID_TOKEN_NAME, LOGIN_TOKEN_NAME } from "../../utils/constants";

const AxiosBaseline = () => {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    axios.defaults.baseURL = BACKEND_HOST + "/mobile"
    axios.interceptors.request.use(e => {
      const regexp = /^\/auth(\/\S)*/;
      if (regexp.test(e.url || "")) {
        return e
      } 
      
      const loginToken = localStorage.getItem(LOGIN_TOKEN_NAME)
      const bussinessId = localStorage.getItem(BUSINESS_ID_TOKEN_NAME)
      if (!loginToken || !bussinessId) {
        enqueueSnackbar("登录状态失效", {variant: "error"})
        return Promise.reject()
      }

      e.headers.Authorization = `Bearer ${loginToken}`
      e.headers["bussiness-id"] = bussinessId

      return e
    })
    axios.interceptors.response.use(
      e => e.data,
      e => {
        if (e instanceof AxiosError && e.status === 401) {
          enqueueSnackbar("登录状态失效", {variant: "error"})
        } else {
          enqueueSnackbar("接口异常，请重试", {variant: "error"})
        }
        return Promise.reject(e);
      }
    )
  }, []);
  
  return <></>
}

export default AxiosBaseline
