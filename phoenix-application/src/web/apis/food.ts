import axios from "axios";
import { ApiResponse } from "../utils/constants";

const apiCreateFood = "/food/create/:storeId"
type createFoodRequestBody = {
  name: string;
  img: File;
  price: number;
}
export const createFood = function(storeId: string, data: createFoodRequestBody) {
  return axios.post<{}, ApiResponse>(apiCreateFood.replace(":storeId", storeId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}