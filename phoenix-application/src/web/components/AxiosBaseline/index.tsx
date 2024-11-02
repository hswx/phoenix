import React from "react"
import axios, { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { LOGIN_TOKEN_NAME } from "./../../utils/constants";

const AxiosBaseline = () => {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    axios.defaults.baseURL = "http://127.0.0.1:3001/"
    // axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.interceptors.request.use(e => {
      const regexp = /^\/auth\/\S+/;
      if (regexp.test(e.url)) {
        return e
      } 
      
      const loginToken = localStorage.getItem(LOGIN_TOKEN_NAME)
      if (!loginToken) {
        location.href = location.origin + location.pathname + "#/login"
        return Promise.reject()
      }

      e.headers.Authorization = `Bearer ${loginToken}`
      return e
    })
    axios.interceptors.response.use(
      e => e.data,
      e => {
        if (e instanceof AxiosError && e.status === 401) {
          location.href = location.origin + location.pathname + "#/login"
        } else {
          enqueueSnackbar("接口异常，请重试", {variant: "error"})
        }
        return e;
      }
    )
  }, []);
  
  return <></>
}

export default AxiosBaseline
