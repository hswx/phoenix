import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import apis from "../apis";

const NameSpace = "Root";

const getRootInisialState = () => ({
  bussinessId: undefined
})

// const auth = createAsyncThunk(
//   `${NameSpace}/auth`,
//   async () => {
//     const res = await apis.auth.auth();
//     return res
//   },
// )

const RootSlice = createSlice({
  name: NameSpace,
  initialState: getRootInisialState(),
  reducers: {
    // setBussinessId (state, action) {
    //   state.bussinessId = action.payload
    // }
  },
  // extraReducers: (builder) => {
    // builder.addCase(getStoreInfo.fulfilled, (state, action) => {
    //   state.bussinessId = action.payload
    // })
  // }
})

export const RootReducer = RootSlice.reducer
export const RootActions = {
  ...RootSlice.actions,
}
