import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Transition from "./../../../../../../components/Transition/SlideUp";
import { useAppSelector } from "./../../../../../../stores";
import { useSnackbar } from "notistack";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";

type DeleteEmployeeProps = {
  employeeIds: string[];
  onDeleted: () => void;
}

const DeleteEmployee = (props: DeleteEmployeeProps) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button variant="contained" color="error" onClick={onDialogOpen}>删除员工</Button>
    <DeleteEmployeeDialog
      open={dialogVisible}
      onClose={onDialogClose}
      employeeIds={props.employeeIds}
      onDeleted={props.onDeleted}
    />
  </>
}

interface DeleteEmployeeDialogProps extends DeleteEmployeeProps {
  open: boolean;
  onClose: () => void;
}
const DeleteEmployeeDialog = (props: DeleteEmployeeDialogProps) => {
  const storeId = useAppSelector(state => state.Root.storeId)

  const { enqueueSnackbar } = useSnackbar()

  const onDeleted = async () => {
    if (!storeId) {
      return
    }

    const res = await apis.employee.deleteEmployee({storeId}, {employeeIds: props.employeeIds})

    if (res.code === API_CODES.SUCCESS) {
      props.onDeleted()
      props.onClose()
      enqueueSnackbar("员工删除成功", {variant: "success"})
    } else {
      enqueueSnackbar("员工删除失败", {variant: "error"})
    }
  }

  return <Dialog
        open={props.open}
        TransitionComponent={Transition}
        onClose={props.onClose}
      >
        <DialogTitle>删除员工</DialogTitle>
        <DialogContent>
          <DialogContentText  >
            确定要删除员工吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>取消</Button>
          <Button onClick={onDeleted}>确定</Button>
        </DialogActions>
      </Dialog>
}

export default DeleteEmployee
