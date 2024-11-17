import axios from "axios"

const apiCreateOrder = "/order/create"
export const createOrder = (data) => {
  return axios.post(apiCreateOrder, data)
}

const apiGetOrderDetail = "/order/:orderId"
export const getOrderDetail = (params) => {
  return axios.get(apiGetOrderDetail.replace(":orderId", params.orderId))
}

const apiGetOrderList = "/order/list"
export const getOrderList = () => {
  return axios.get(apiGetOrderList)
}