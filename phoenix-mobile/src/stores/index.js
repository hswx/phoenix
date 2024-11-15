import { configureStore } from "@reduxjs/toolkit";
import { RootReducer } from "./RootSlice";
import { FoodReducer } from "../views/Food/store";

const store = configureStore({
  reducer: {
    Root: RootReducer,
    Food: FoodReducer,
  }
})

export default store;
