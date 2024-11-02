import API_CODES from "./API_CODES";

export enum TEXT_FIELD_ERROR_TYPE {
  UNKNOWN = -1,
  NORMAL = 0,
  REQUIRED = 1,
  TELEPHONE_INVALID = 2,
  PASSWORD_LEN_8 = 3,
  DOUBLE_PASSWROD_NOT_COMPARE = 4,
}

export interface ApiResponse<T = unknown> {
  code: API_CODES;
  data?: T;
  message?: string;
}

export const LOGIN_TOKEN_NAME = "phoenix-token"
