import axios from "axios"

const apiGetStoreInfo = "/store"
export const getStoreInfo = () => {
  return axios.get(apiGetStoreInfo)
}