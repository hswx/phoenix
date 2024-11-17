import { createSlice } from "@reduxjs/toolkit";
import { BOTTOM_TAB } from "../utils/constants";

const NameSpace = "Root";

const getRootInisialState = () => ({
  currentBottomTab: BOTTOM_TAB.HOME,
})

const RootSlice = createSlice({
  name: NameSpace,
  initialState: getRootInisialState(),
  reducers: {
    setCurrentBottomTab(state, action) {
      state.currentBottomTab = action.payload
    }
  }
})

export const RootReducer = RootSlice.reducer
export const RootActions = RootSlice.actions
