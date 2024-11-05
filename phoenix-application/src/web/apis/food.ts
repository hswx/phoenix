import axios from "axios";
import { ApiResponse } from "../utils/constants";

const apiCreateFood = "/food/create/:storeId"
type createFoodRequestParam = {
  storeId: string;
}
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
export const createFood = function(param: createFoodRequestParam, data: createFoodRequestBody): Promise<ApiResponse<createFoodResponseBody>> {
  return axios.post(apiCreateFood.replace(":storeId", param.storeId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

type updateFoodRequestParam = {
  storeId: string;
  foodId: string;
}
type updateFoodRequestBody = {
  name: string;
  img?: File;
  imgPath?: string;
  price: number;
}
type updateFoodResponse = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
}

const apiUpdateFood = "/food/update/:storeId/:foodId"
export const updateFood = (param: updateFoodRequestParam, data: updateFoodRequestBody): Promise<ApiResponse<updateFoodResponse>> => {
  return axios.put(apiUpdateFood.replace(":storeId", param.storeId).replace(":foodId", param.foodId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const apiGetFoodList = "/food/list/:storeId"
type getFoodListRequestParam = {
  storeId: string;
}
type getFoodListResponse = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  soldOut: boolean;
  createdAt: Date;
}[]
export const getFoodList = (param: getFoodListRequestParam): Promise<ApiResponse<getFoodListResponse>> => {
  return axios.get(apiGetFoodList.replace(":storeId", param.storeId))
}

const apiDeleteFoodList = "/food/delete/:storeId"
type deleteFoodListRequestParam = {
  storeId: string;
}
type deleteFoodListRequestBody = {
  foodList: string[];
}
export const deleteFood = (param: deleteFoodListRequestParam, data: deleteFoodListRequestBody): Promise<ApiResponse> => {
  return axios.delete(apiDeleteFoodList.replace(":storeId", param.storeId), {data})
}

const apiSoldOutFoodList = "/food/soldout/:storeId"
type soldOutFoodListRequestParam = {
  storeId: string;
}
type soldOutFoodListRequestBody = {
  foodList: string[];
  soldOut: boolean;
}
export const soldOutFood = (param: soldOutFoodListRequestParam, data: soldOutFoodListRequestBody): Promise<ApiResponse> => {
  return axios.patch(apiSoldOutFoodList.replace(":storeId", param.storeId), data)
}
