import axios from "axios"

const apiGetFoodList = "/food/list"
export const getFoodList = () => {
  return axios.get(apiGetFoodList)
}

const apiGetFoodFullist = "/food/fullist"
export const getFoodFullist = () => {
  return axios.get(apiGetFoodFullist)
}
