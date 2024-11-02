import axios from "axios"
import { ApiResponse } from "../utils/constants";

const apiGetStoreInfo = "/store/info"
type getStoreInfoResponse = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
}
export const getStoreInfo = function() {
  return axios.get<{}, ApiResponse<getStoreInfoResponse>>(apiGetStoreInfo)
}

const apiUpdateStoreInfo = "/store/info/:id"
type updateStoreInfoRequest = {
  name: string;
  address: string;
  ownerName: string;
}
export const updateStoreInfo = function(id: string, data: updateStoreInfoRequest) {
  return axios.put<{}, ApiResponse>(apiUpdateStoreInfo.replace(":id", id), data)
}