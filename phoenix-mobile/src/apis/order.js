import axios from "axios"

const apiCreateOrder = "/mobile/order/create"
export const createOrder = (data) => {
  return axios.post(apiCreateOrder, data)
}

const apiGetOrderDetail = "/mobile/order/:orderId"
export const getOrderDetail = (params, query) => {
  return axios.get(apiGetOrderDetail.replace(":orderId", params.orderId), {
    params: query
  })
}

const apiGetOrderList = "/mobile/order/list"
export const getOrderList = (query) => {
  return axios.get(apiGetOrderList, {
    params: query
  })
}