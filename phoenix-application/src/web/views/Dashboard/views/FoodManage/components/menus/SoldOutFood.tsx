import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "./../../../../../../components/Transition/SlideUp";
import { useAppSelector } from "./../../../../../../stores";
import { useSnackbar } from "notistack";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";

type SoldOutFoodProps = {
  foodIds: string[];
  soldOut: boolean;
  onSoldOuted: () => void;
}

export const SoldOutFood = (props: SoldOutFoodProps) => {
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

interface SoldOutFoodDialogProps extends SoldOutFoodProps {
  open: boolean;
  onClose: () => void;
}
const SoldOutFoodDialog = (props: SoldOutFoodDialogProps) => {
  const storeId = useAppSelector(state => state.Root.storeId)

  const { enqueueSnackbar } = useSnackbar()

  const onSoldOuted = async () => {
    if (!storeId) {
      return
    }

    const res = await apis.food.soldOutFood({storeId}, {foodList: props.foodIds, soldOut: props.soldOut})

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
          <Button onClick={onSoldOuted}>确定</Button>
        </DialogActions>
      </Dialog>
}

export default SoldOutFood
