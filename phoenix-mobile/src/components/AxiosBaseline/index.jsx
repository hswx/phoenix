import React from "react"
import axios, { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { BACKEND_HOST, LOGIN_TOKEN_NAME } from "../../utils/constants";

const AxiosBaseline = () => {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    axios.defaults.baseURL = BACKEND_HOST
    // axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.interceptors.request.use(e => {
      const regexp = /^\/auth\/\S+/;
      if (regexp.test(e.url || "")) {
        return e
      } 
      
      const loginToken = localStorage.getItem(LOGIN_TOKEN_NAME) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjUzNzExODI3LWQ1NmItNGFmOC1iMjkyLWQ2ZGI0YWRkMTBiOCIsImlhdCI6MTczMTY3NTEwMCwiZXhwIjoxNzMyMDM1MTAwfQ.iKnB1xfeFYWsr52zdjtMXkz86yLHoE857eELnhYvk2E"
      if (!loginToken) {
        enqueueSnackbar("登录状态失效", {variant: "error"})
        return Promise.reject()
      }

      e.headers.Authorization = `Bearer ${loginToken}`
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
