import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AsyncButton from './../../../components/AsyncButton';
import { useSnackbar } from 'notistack';
import { Box, FormControl, FormLabel, TextField } from '@mui/material';
import apis from './../../../apis';
import API_CODES from './../../../utils/API_CODES';
import RequiredTag from '../../../components/RequiredTag';

const validateField = (key) => (value) => {
  let state = undefined
  let tip = ""
  switch(key) {
    case "name":
      if (value) {
        state = false
        tip = ""
      } else {
       state = true
        tip = "请输入门店名称"
      }
      break;
    case "address":
      if (value) {
        state = false
        tip = ""
      } else {
        state = true
        tip = "请输入门店地址"
      }
      break;
    case "ownerName":
      if (value) {
        state = false
        tip = ""
      } else {
        state = true
        tip = "请输入姓名"
      }
      break;
    default:
      break;
  }
  return {state, tip}
}

const UpdateStoreDialog = (props) => {
  const [storeFields, setStoreFields] = React.useState({
    name: "",
    address: "",
    ownerName: "",
  })

  const [storeFieldsValid, setStoreFieldsValid] = React.useState({
    name: {
      state: undefined,
      tip: "",
    },
    address: {
      state: undefined,
      tip: "",
    },
    ownerName: {
      state: undefined,
      tip: "",
    }
  })

  const onStoreFieldChange = (key) => (event) => {
    setStoreFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setStoreFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: "",
      }
    }))
  }

  const onStoreFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value)
    setStoreFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
  }

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async () => {
    const validateList = Object.keys(storeFieldsValid)
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(storeFields[key]);
      if (validRes.state !== false) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

      const res = await apis.store.updateStoreInfo({
        name: storeFields.name,
        address: storeFields.address,
        ownerName: storeFields.ownerName,
      })
      if (res.code === API_CODES.SUCCESS) {
        enqueueSnackbar("门店信息修改成功", {variant: "success"})
        props.setStoreInfo({
          name: storeFields.name,
          address: storeFields.address,
          ownerName: storeFields.ownerName,
        })
        props.onClose()
      }else {
        enqueueSnackbar("门店信息修改失败", {variant: "error"})
      }
  }

  React.useEffect(() => {
    if (props.open) {
      const originalStoreInfo = props.storeInfo
      setStoreFields({
        name: originalStoreInfo.name,
        address: originalStoreInfo.address,
        ownerName: originalStoreInfo.ownerName,
      })
      setStoreFieldsValid({
        name: {state: undefined, tip: ""},
        address: {state: undefined, tip: ""},
        ownerName: {state: undefined, tip: ""},
      })
    }
  }, [props.open]);

  return (
      <Dialog
        open={props.open}
        onClose={props.onClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>修改门店资料</DialogTitle>
        <DialogContent dividers={true}>
        <Box
          component="form"
          autoComplete="off"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>店长<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入姓名"
              error={storeFieldsValid["ownerName"].state}
              helperText={storeFieldsValid["ownerName"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["ownerName"]}
              onChange={onStoreFieldChange("ownerName")}
              onBlur={onStoreFieldBlur("ownerName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>门店名称<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入门店名称"
              required
              error={storeFieldsValid["name"].state}
              helperText={storeFieldsValid["name"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["name"]}
              onChange={onStoreFieldChange("name")}
              onBlur={onStoreFieldBlur("name")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>门店地址<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入门店地址"
              required
              error={storeFieldsValid["address"].state}
              helperText={storeFieldsValid["address"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["address"]}
              onChange={onStoreFieldChange("address")}
              onBlur={onStoreFieldBlur("address")}
            />
          </FormControl>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>取消</Button>
          <AsyncButton onClick={onSubmit}>保存</AsyncButton>
        </DialogActions>
      </Dialog>
  );
}

export default UpdateStoreDialog
