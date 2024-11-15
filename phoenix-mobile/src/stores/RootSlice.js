import { createSlice } from "@reduxjs/toolkit";
import { BOTTOM_TAB } from "../utils/constants";

const NameSpace = "Root";

const getRootInisialState = () => ({
  storeId: 'd2ef2157-b448-42f5-a6e6-0f358f73ac3e',
  employeeId: "2dfa33ff-0f70-47af-acde-2753f369b830",
  currentBottomTab: BOTTOM_TAB.HOME,
})

const RootSlice = createSlice({
  name: NameSpace,
  initialState: getRootInisialState(),
  reducers: {
    setStoreId(state, action) {
      state.storeId = action.payload
    },
    setCurrentBottomTab(state, action) {
      state.currentBottomTab = action.payload
    }
  }
})

export const RootReducer = RootSlice.reducer
export const RootActions = RootSlice.actions
