import * as authApis from "./auth"
import * as storeApis from "./store"
import * as foodApis from "./food"
import * as categoryApis from "./category"
import * as employeeApis from "./employee"

export default {
  auth: authApis,
  store: storeApis,
  food: foodApis,
  category: categoryApis,
  employee: employeeApis,
}