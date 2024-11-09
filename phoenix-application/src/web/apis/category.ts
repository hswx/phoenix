import axios from "axios";
import { ApiResponse, CategoryType } from "../utils/constants";
import { Food } from "../views/Dashboard/views/FoodManage";

const apiCreateCategory = "/category/create"
type createCategoryRequestQuery = {
  storeId: string;
}
export type createCategoryRequestBody = {
  name: string;
  ruleType: CategoryType;
  addFoodList?: string[];
  removeFoodList?: string[];
  query?: string;
}
export const createCategory = function(query: createCategoryRequestQuery, data: createCategoryRequestBody): Promise<ApiResponse> {
  return axios.post(apiCreateCategory, data, {params: query})
}

const apiGetCategory = "/category/:categoryId"
type getCategoryRequestParam = {
  categoryId: string;
}
type getCategoryRequestQuery = {
  storeId: string;
}
type getCategoryResponse = {
  name: string;
  ruleType: CategoryType;
  foodList?: string[];
  query?: string;
}
export const getCategory = function(param: getCategoryRequestParam, query: getCategoryRequestQuery): Promise<ApiResponse<getCategoryResponse>> {
  return axios.get(apiGetCategory.replace(":categoryId", param.categoryId), {params: query})
}

type updateCategoryRequestParam = {
  categoryId: string;
}
type updateCategoryRequestQuery = {
  storeId: string;
}
export type updateCategoryRequestBody = {
  name: string;
  ruleType: CategoryType;
  addFoodList?: string[];
  removeFoodList?: string[];
  query?: string;
}
const apiUpdateCategory = "/category/:categoryId"
export const updateCategory = (param: updateCategoryRequestParam, query: updateCategoryRequestQuery, data: updateCategoryRequestBody): Promise<ApiResponse> => {
  return axios.put(apiUpdateCategory.replace(":categoryId", param.categoryId), data, {
    params: query
  })
}

const apiGetCategoryList = "/category/list"
type getCategoryListRequestQuery = {
  storeId: string;
}
type getCategoryListResponse = {
  id: string;
  name: string;
  ruleType: CategoryType;
  foodCount: number;
  createdAt: Date;
}[]
export const getCategoryList = (query: getCategoryListRequestQuery): Promise<ApiResponse<getCategoryListResponse>> => {
  return axios.get(apiGetCategoryList, {
    params: query
  })
}

const apiDeleteCategoryList = "/category/delete"
type deleteCategoryListRequestQuery = {
  storeId: string;
}
type deleteCategoryListRequestBody = {
  categoryIds: string[];
}
export const deleteCategory = (query: deleteCategoryListRequestQuery, data: deleteCategoryListRequestBody): Promise<ApiResponse> => {
  return axios.delete(apiDeleteCategoryList, {
    params: query,
    data
  })
}

