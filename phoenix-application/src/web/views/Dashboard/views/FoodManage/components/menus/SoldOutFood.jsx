import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "./../../../../../../components/Transition/SlideUp";
import { useSnackbar } from "notistack";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";
import AsyncButton from "../../../../../../components/AsyncButton";

export const SoldOutFood = (props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button variant="contained" color="warning" onClick={onDialogOpen}>
      {props.soldOut ? "下架菜品" : "上架菜品"}
    </Button>
    <SoldOutFoodDialog
      open={dialogVisible}
      onClose={onDialogClose}
      foodIds={props.foodIds}
      soldOut={props.soldOut}
      onSoldOuted={props.onSoldOuted}
    />
  </>
}

const SoldOutFoodDialog = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const onSoldOuted = async () => {
    const res = await apis.food.soldOutFood({foodList: props.foodIds, soldOut: props.soldOut})

    if (res.code === API_CODES.SUCCESS) {
      props.onSoldOuted()
      props.onClose()
      enqueueSnackbar(props.soldOut ? "菜品下架成功": "菜品上架成功", {variant: "success"})
    } else {
      enqueueSnackbar(props.soldOut ? "菜品下架失败": "菜品上架失败", {variant: "error"})
    }
  }

  return <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={props.onClose}
      >
        <DialogTitle>下架菜品</DialogTitle>
        <DialogContent>
          <DialogContentText  >
            确定要下架菜品吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>取消</Button>
          <AsyncButton onClick={onSoldOuted}>确定</AsyncButton>
        </DialogActions>
      </Dialog>
}

export default SoldOutFood
