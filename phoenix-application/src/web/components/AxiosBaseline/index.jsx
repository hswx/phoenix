import React from "react"
import axios, { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { BACKEND_HOST, BUSINESS_ID_TOKEN_NAME, LOGIN_TOKEN_NAME } from "./../../utils/constants";
import { useSelector } from "react-redux";

const AxiosBaseline = () => {
  const { enqueueSnackbar } = useSnackbar();

  const bussinessId = useSelector(state => state.Root.bussinessId)

  React.useEffect(() => {
    axios.defaults.baseURL = BACKEND_HOST
    const requestInterceptorId = axios.interceptors.request.use(e => {
      const regexp = /^\/auth\/\S+/;
      if (regexp.test(e.url)) {
        return e
      } 
      
      const loginToken = localStorage.getItem(LOGIN_TOKEN_NAME)
      const bussinessId = localStorage.getItem(BUSINESS_ID_TOKEN_NAME)
      if (!loginToken || !bussinessId) {
        location.href = location.origin + location.pathname + "#/"
        return Promise.reject()
      }

      e.headers.Authorization = `Bearer ${loginToken}`
      e.headers["bussiness-id"] = bussinessId

      return e
    })
    const responseInterceptorId = axios.interceptors.response.use(
      e => e.data,
      e => {
        if (e instanceof AxiosError && e.status === 401) {
          location.href = location.origin + location.pathname + "#/"
        } else {
          enqueueSnackbar("接口异常，请重试", {variant: "error"})
        }
        return Promise.reject(e);
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptorId)
      axios.interceptors.response.eject(responseInterceptorId)
    }
  }, [bussinessId]);
  
  return <></>
}

export default AxiosBaseline
