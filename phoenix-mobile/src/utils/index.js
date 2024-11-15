import { CUISINE_STR, FLAVOR_STR } from "./constants"

export const getFoodDescription = (cuisine, flavor) => {
  let flavorStr = flavor.map(item => FLAVOR_STR[item]).join(",")
  let cuisineStr = CUISINE_STR[cuisine]
  return cuisineStr + (cuisineStr && flavorStr ? " ": "") + flavorStr
}
