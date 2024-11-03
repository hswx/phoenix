import axios from "axios";
import { ApiResponse } from "../utils/constants";

const apiCreateFood = "/food/create/:storeId"
type createFoodRequestBody = {
  name: string;
  img: File;
  price: number;
}
type createFoodResponseBody = {
  name: string;
  imgPath: string;
  price: number;
}
export const createFood = function(storeId: string, data: createFoodRequestBody) {
  return axios.post<{}, ApiResponse<createFoodResponseBody>>(apiCreateFood.replace(":storeId", storeId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const apiUpdateFood = "/food/update/:storeId/:foodId"
export const updateFood: Promise<any> = function(storeId: string, foodId: string, data: any) {
  return axios.put(apiUpdateFood.replace(":storeId", storeId).replace(":foodId", foodId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const apiGetFoodList = "/food/list/:storeId"
type getFoodListResponseBody = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  soldOut: boolean;
  createdAt: Date;
}[]
export const getFoodList = function(storeId: string) {
  return axios.get<{}, ApiResponse<getFoodListResponseBody>>(apiGetFoodList.replace(":storeId", storeId))
}