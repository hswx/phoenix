import API_CODES from "./API_CODES"

export type commonResponse<T = undefined> = {
  code: API_CODES,
  data?: T,
  message?: string
}
export const generateResponse = <T>(code: API_CODES, data?: T, message?: string): commonResponse<T> => {
  return {
    code,
    data,
    message: code === API_CODES.SUCCESS ? "Success": message
  }
}