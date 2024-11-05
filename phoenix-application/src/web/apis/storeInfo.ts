import axios from "axios"
import { ApiResponse } from "../utils/constants";

const apiGetStoreInfo = "/store/info"
type getStoreInfoResponse = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
}
export const getStoreInfo = function(): Promise<ApiResponse<getStoreInfoResponse>> {
  return axios.get(apiGetStoreInfo)
}

const apiUpdateStoreInfo = "/store/info/:id"
type updateStoreInfoRequestParam = {
  id: string
}
type updateStoreInfoRequest = {
  name: string;
  address: string;
  ownerName: string;
}
export const updateStoreInfo = function(param: updateStoreInfoRequestParam, data: updateStoreInfoRequest): Promise<ApiResponse> {
  return axios.put(apiUpdateStoreInfo.replace(":id", param.id), data)
}