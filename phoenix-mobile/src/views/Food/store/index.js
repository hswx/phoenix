import { createSlice } from "@reduxjs/toolkit"

const NameSpace = "Food"

const getInitialState = () => ({
  categoryFoodList: [],
  shoppingCart: {},
})

const FoodSlice = createSlice({
  name: NameSpace,
  initialState: getInitialState(),
  reducers: {
    initStore (state) {
      Object.assign(state, getInitialState())
    },
    addFood (state, action) {
      const food = action.payload
      const foodId = food.id
      if (state.shoppingCart[foodId]) {
        const count = state.shoppingCart[foodId].count + 1
        state.shoppingCart[foodId].count = count
      } else {
        state.shoppingCart[foodId] = {
          count: 1,
          food: food
        }
      }
    },
    removeFood (state, action) {
      const food = action.payload
      const foodId = food.id
      if (state.shoppingCart[foodId]) {
        const count = state.shoppingCart[foodId].count - 1
        state.shoppingCart[foodId].count = count
        if (count <= 0) {
          delete state.shoppingCart[foodId]
        }
      }
    },
  }
})

export const FoodReducer = FoodSlice.reducer
export const FoodActions = FoodSlice.actions
