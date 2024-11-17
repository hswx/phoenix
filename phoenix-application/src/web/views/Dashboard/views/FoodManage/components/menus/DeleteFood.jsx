import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "./../../../../../../components/Transition/SlideUp";
import { useSnackbar } from "notistack";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";
import AsyncButton from "../../../../../../components/AsyncButton";

const DeleteFood = (props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button variant="contained" color="error" onClick={onDialogOpen}>删除菜品</Button>
    <DeleteFoodDialog
      open={dialogVisible}
      onClose={onDialogClose}
      foodIds={props.foodIds}
      onDeleted={props.onDeleted}
    />
  </>
}

const DeleteFoodDialog = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const onDeleted = async () => {
    const res = await apis.food.deleteFood({foodList: props.foodIds})

    if (res.code === API_CODES.SUCCESS) {
      props.onDeleted()
      props.onClose()
      enqueueSnackbar("菜品删除成功", {variant: "success"})
    } else {
      enqueueSnackbar("菜品删除失败", {variant: "error"})
    }
  }

  return <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={props.onClose}
      >
        <DialogTitle>删除菜品</DialogTitle>
        <DialogContent>
          <DialogContentText  >
            确定要删除菜品吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>取消</Button>
          <AsyncButton onClick={onDeleted}>确定</AsyncButton>
        </DialogActions>
      </Dialog>
}

export default DeleteFood
