import axios from "axios"

const apiGetFoodList = "/mobile/food/list"
export const getFoodList = (query) => {
  return axios.get(apiGetFoodList, {
    params: {
      storeId: query.storeId
    }
  })
}

const apiGetFoodFullist = "/mobile/food/fullist"
export const getFoodFullist = (query) => {
  return axios.get(apiGetFoodFullist, {
    params: {
      storeId: query.storeId
    }
  })
}
