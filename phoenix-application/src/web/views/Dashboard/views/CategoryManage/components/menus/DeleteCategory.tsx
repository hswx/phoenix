import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "../../../../../../components/Transition/SlideUp";
import { useAppSelector } from "../../../../../../stores";
import { useSnackbar } from "notistack";
import apis from "../../../../../../apis";
import API_CODES from "../../../../../../utils/API_CODES";

type DeleteCategoryProps = {
  categoryIds: string[];
  onDeleted: () => void;
}

const DeleteCategory = (props: DeleteCategoryProps) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button variant="contained" color="error" onClick={onDialogOpen}>删除分类</Button>
    <DeleteCategoryDialog
      open={dialogVisible}
      onClose={onDialogClose}
      categoryIds={props.categoryIds}
      onDeleted={props.onDeleted}
    />
  </>
}

interface DeleteCategoryDialogProps extends DeleteCategoryProps {
  open: boolean;
  onClose: () => void;
}
const DeleteCategoryDialog = (props: DeleteCategoryDialogProps) => {
  const storeId = useAppSelector(state => state.Root.storeId)

  const { enqueueSnackbar } = useSnackbar()

  const onDeleted = async () => {
    if (!storeId) {
      return
    }

    const res = await apis.category.deleteCategory({storeId}, {categoryIds: props.categoryIds})

    if (res.code === API_CODES.SUCCESS) {
      props.onDeleted()
      props.onClose()
      enqueueSnackbar("分类删除成功", {variant: "success"})
    } else {
      enqueueSnackbar("分类删除失败", {variant: "error"})
    }
  }

  return <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={props.onClose}
      >
        <DialogTitle>删除分类</DialogTitle>
        <DialogContent>
          <DialogContentText  >
            确定要删除分类吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>取消</Button>
          <Button onClick={onDeleted}>确定</Button>
        </DialogActions>
      </Dialog>
}

export default DeleteCategory
