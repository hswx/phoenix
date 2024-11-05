import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AsyncButton from './../../../components/AsyncButton';
import { TEXT_FIELD_ERROR_TYPE } from './../../../utils/constants';
import { useSnackbar } from 'notistack';
import { Box, FormControl, FormLabel, TextField } from '@mui/material';
import { useAppSelector } from './../../../stores';
import apis from './../../../apis';
import API_CODES from './../../../utils/API_CODES';

export interface StoreFieldsData {
  ownerName: string;
  storeName: string;
  storeAddress: string;
}

type UpdateStoreDialogProps = {
  storeInfo: StoreFieldsData;
  setStoreInfo: (e: StoreFieldsData) => void;
  open: boolean;
  onClose: () => void;
}

type StoreFieldsDataKeys = keyof StoreFieldsData

const UpdateStoreDialog = (props: UpdateStoreDialogProps) => {
  const [storeFields, setStoreFields] = React.useState<StoreFieldsData>({
    ownerName: "",
    storeName: "",
    storeAddress: "",
  })

  const [storeFieldsError, setStoreFieldsError] = React.useState<Record<StoreFieldsDataKeys, TEXT_FIELD_ERROR_TYPE>>({
    ownerName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    storeName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    storeAddress: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const storeFieldsErrorTips: {
    [storeFieldsKey in (StoreFieldsDataKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    ownerName: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入姓名"
    },
    storeName: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入门店名称",
    },
    storeAddress: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入门店地址",
    }
  }

  const onStoreFieldChange = (key: StoreFieldsDataKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoreFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setStoreFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: StoreFieldsDataKeys) => (value: string) => {
    let fieldsState = TEXT_FIELD_ERROR_TYPE.UNKNOWN
    if (value) {
      fieldsState = TEXT_FIELD_ERROR_TYPE.NORMAL
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setStoreFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onStoreFieldBlur = (key: StoreFieldsDataKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const getFieldErrorState = (key: StoreFieldsDataKeys) => {
    return storeFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && storeFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldErrorTip = (key: StoreFieldsDataKeys) => {
    const errorType = storeFieldsError[key]
    return storeFieldsErrorTips[key][errorType] || ""
  }

  const { enqueueSnackbar } = useSnackbar();

  const storeId = useAppSelector(state => state.Root.storeId)

  const onSubmit = async () => {
    if (!storeId) {
      return
    }

    const validateList = Object.keys(storeFields) as Array<StoreFieldsDataKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(storeFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

      const res = await apis.store.updateStoreInfo({id: storeId}, {
        name: storeFields.storeName,
        address: storeFields.storeAddress,
        ownerName: storeFields.ownerName,
      })
      if (res.code === API_CODES.SUCCESS) {
        enqueueSnackbar("门店信息修改成功", {variant: "success"})
        props.setStoreInfo({
          ownerName: storeFields.ownerName,
          storeName: storeFields.storeName,
          storeAddress: storeFields.storeAddress,
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
        ownerName: originalStoreInfo.ownerName,
        storeName: originalStoreInfo.storeName,
        storeAddress: originalStoreInfo.storeAddress,
      })
      setStoreFieldsError({
        ownerName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
        storeName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
        storeAddress: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
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
            <FormLabel>店长</FormLabel>
            <TextField
              placeholder="请输入姓名"
              error={getFieldErrorState("ownerName")}
              helperText={getFieldErrorTip("ownerName")}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["ownerName"]}
              onChange={onStoreFieldChange("ownerName")}
              onBlur={onStoreFieldBlur("ownerName")}
            />
          </FormControl>
      
      
          <FormControl>
            <FormLabel>门店名称</FormLabel>
            <TextField
              placeholder="请输入门店名称"
              required
              error={getFieldErrorState("storeName")}
              helperText={getFieldErrorTip("storeName")}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["storeName"]}
              onChange={onStoreFieldChange("storeName")}
              onBlur={onStoreFieldBlur("storeName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>门店地址</FormLabel>
            <TextField
              placeholder="请输入门店地址"
              required
              error={getFieldErrorState("storeAddress")}
              helperText={getFieldErrorTip("storeAddress")}
              fullWidth
              variant="standard"
              size="small"
              value={storeFields["storeAddress"]}
              onChange={onStoreFieldChange("storeAddress")}
              onBlur={onStoreFieldBlur("storeAddress")}
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
