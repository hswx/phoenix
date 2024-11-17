import axios from "axios";

const apiAuth = "/auth"
export const auth = (query) => {
  return axios.get(apiAuth, {params: query})
}
