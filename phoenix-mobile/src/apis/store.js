import axios from "axios"

const apiGetStoreInfo = "/mobile/store/:storeId"
export const getStoreInfo = (params) => {
  return axios.get(apiGetStoreInfo.replace(":storeId", params.storeId))
}