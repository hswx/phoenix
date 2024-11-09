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

export enum Cuisine {
  UNKNOWN,
  LU_CAI,
  CHUAN_CAI,
  YUE_CAI,
  SU_CAI,
  MIN_CAI,
  ZHE_CAI,
  XIANG_CAI,
  HUI_CAI,
}

export enum Flavor {
  SWEET,
  SOUR,
  SPICY,
}

export enum CategoryType {
  SELECTED_CATEGORY,
  DYNAMIC_CATEGORY,
}
