import React from "react"
import axios from "axios";
import { useSnackbar } from "notistack";

const AxiosBaseline = () => {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    axios.defaults.baseURL = "http://127.0.0.1:3001/"
    // axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.interceptors.response.use(
      e => e.data,
      e => {
        enqueueSnackbar("接口异常，请重试", {variant: "error"})
        return e;
      }
    )
  }, []);
  
  return <></>
}

export default AxiosBaseline
