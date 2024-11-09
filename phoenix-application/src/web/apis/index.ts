import * as authApis from "./auth"
import * as storeInfoApis from "./storeInfo"
import * as foodApis from "./food"
import * as categoryApis from "./category"
import * as employeeApis from "./employee"

export default {
  auth: authApis,
  store: storeInfoApis,
  food: foodApis,
  category: categoryApis,
  employee: employeeApis,
}