import axios from "axios";

const apiCreateCategory = "/category/create"
export const createCategory = (data) => {
  return axios.post(apiCreateCategory, data)
}

const apiGetCategory = "/category/:categoryId"
export const getCategory = (param) => {
  return axios.get(apiGetCategory.replace(":categoryId", param.categoryId))
}

const apiUpdateCategory = "/category/:categoryId"
export const updateCategory = (param, data) => {
  return axios.put(apiUpdateCategory.replace(":categoryId", param.categoryId), data)
}

const apiGetCategoryList = "/category/list"
export const getCategoryList = () => {
  return axios.get(apiGetCategoryList)
}

const apiDeleteCategoryList = "/category/delete"
export const deleteCategory = (data) => {
  return axios.delete(apiDeleteCategoryList, {
    data
  })
}
