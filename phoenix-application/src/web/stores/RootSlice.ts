import { createSlice } from "@reduxjs/toolkit";

const NameSpace = "Root";

const getRootInisialState = () => ({
  storeId: undefined
}) as {
  storeId: string | undefined
}

const RootSlice = createSlice({
  name: NameSpace,
  initialState: getRootInisialState(),
  reducers: {
    setStoreId(state, action) {
      state.storeId = action.payload
    }
  }
})

export const RootReducer = RootSlice.reducer
export const RootActions = RootSlice.actions
