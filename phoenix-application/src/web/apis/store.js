import axios from "axios"

const apiGetStoreInfo = "/store/info"
export const getStoreInfo = () => {
  return axios.get(apiGetStoreInfo)
}

const apiUpdateStoreInfo = "/store/info"
export const updateStoreInfo = (data) => {
  return axios.put(apiUpdateStoreInfo, data)
}
