import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "./../../../../../../components/Transition/SlideUp";
import { useAppSelector } from "./../../../../../../stores";
import { useSnackbar } from "notistack";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";

type DeleteFoodProps = {
  foodIds: string[];
  onDeleted: () => void;
}

const DeleteFood = (props: DeleteFoodProps) => {
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

interface DeleteFoodDialogProps extends DeleteFoodProps {
  open: boolean;
  onClose: () => void;
}
const DeleteFoodDialog = (props: DeleteFoodDialogProps) => {
  const storeId = useAppSelector(state => state.Root.storeId)

  const { enqueueSnackbar } = useSnackbar()

  const onDeleted = async () => {
    if (!storeId) {
      return
    }

    const res = await apis.food.deleteFood({storeId}, {foodList: props.foodIds})

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
          <Button onClick={onDeleted}>确定</Button>
        </DialogActions>
      </Dialog>
}

export default DeleteFood
