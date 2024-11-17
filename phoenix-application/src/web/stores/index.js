import { configureStore } from "@reduxjs/toolkit";
import { RootReducer } from "./RootSlice";

const store = configureStore({
  reducer: {
    Root: RootReducer
  }
})

export default store;
