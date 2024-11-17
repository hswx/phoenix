import axios from "axios";

const apiCreateFood = "/food/create"
export const createFood = (data) =>  {
  return axios.post(apiCreateFood, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const apiUpdateFood = "/food/update/:foodId"
export const updateFood = (param, data) => {
  return axios.put(apiUpdateFood.replace(":storeId", param.storeId).replace(":foodId", param.foodId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const apiGetFoodList = "/food/list"
export const getFoodList = () => {
  return axios.get(apiGetFoodList)
}

const apiDeleteFoodList = "/food/delete"
export const deleteFood = (data) => {
  return axios.delete(apiDeleteFoodList, {data})
}

const apiSoldOutFoodList = "/food/soldout"
export const soldOutFood = (data) => {
  return axios.patch(apiSoldOutFoodList, data)
}
