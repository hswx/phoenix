import React from "react"
import { AppBar, Box, Drawer, Grid2, Paper } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { BOTTOM_TAB } from "../../utils/constants"
import { RootActions } from "../../stores/RootSlice"
import StoreBar from "./components/StoreBar"
import FoodList from "./components/FoodList"
import ShoppingCart from "./components/ShoppingCart"
import { FoodActions } from "./store"

const Food = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.FOOD))

    return () => {
      dispatch(FoodActions.initStore())
    }
  }, [])

  return <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
    <StoreBar />
    <FoodList />
    <ShoppingCart />
  </Box>
}

export default Food
