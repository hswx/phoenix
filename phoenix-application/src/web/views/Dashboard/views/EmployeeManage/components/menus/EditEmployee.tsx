import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { useSnackbar } from 'notistack';
import { EmployeeSex, TEXT_FIELD_ERROR_TYPE } from './../../../../../../utils/constants';
import { useAppSelector } from './../../../../../../stores';
import apis from './../../../../../../apis';
import API_CODES from './../../../../../../utils/API_CODES';
import AsyncButton from './../../../../../../components/AsyncButton';
import dayjs from 'dayjs';

type EditEmployeeProps = {
  id?: string;
  onSuccess: () => void;
}

const EditEmployee = (props: EditEmployeeProps) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button onClick={onDialogOpen} variant="contained">{props.id ? "修改员工信息" : "添加员工"}</Button>
    <EditEmployeeDialog
      open={dialogVisible}
      onClose={onDialogClose}
      id={props.id}
      onSuccess={props.onSuccess}
    />
  </>
}

type EmployeeFields = {
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: string;
}
type EmployeeFieldsKeys = keyof EmployeeFields
type EmployeeFieldsValidKeys = keyof Omit<EmployeeFields, "age" | "employTime">
interface EditEmployeeDialogProps extends EditEmployeeProps {
  open: boolean;
  onClose: () => void;
}

const EditEmployeeDialog = (props: EditEmployeeDialogProps) => {
  const [employeeFields, setEmployeeFields] = React.useState<EmployeeFields>({
    name: "",
    sex: undefined,
    age: undefined,
    telephoneNumber: "",
    employTime: undefined,
  })

  const [employeeFieldsError, setEmployeeFieldsError] = React.useState<Record<EmployeeFieldsValidKeys, TEXT_FIELD_ERROR_TYPE>>({
    name: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    sex: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    telephoneNumber: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const employeeFieldsErrorTips: {
    [employeeFieldsKey in (EmployeeFieldsValidKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    name: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入员工姓名"
    },
    sex: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入年龄"
    },
    telephoneNumber: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入手机号",
      [TEXT_FIELD_ERROR_TYPE.TELEPHONE_INVALID]: "手机号格式不正确"
    }
  }

  const getFieldErrorState = (key: EmployeeFieldsValidKeys) => {
    return employeeFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && employeeFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldErrorTip = (key: EmployeeFieldsValidKeys) => {
    const errorType = employeeFieldsError[key]
    return employeeFieldsErrorTips[key][errorType] || ""
  }

  const onEmployeeFieldChange = (key: EmployeeFieldsKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setEmployeeFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: EmployeeFieldsKeys) => (value: any) => {
    let fieldsState = TEXT_FIELD_ERROR_TYPE.UNKNOWN
    if (value) {
      fieldsState = TEXT_FIELD_ERROR_TYPE.NORMAL
      switch(key) {
        case "telephoneNumber":
          const regexp = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/
          if (!regexp.test(value)) {
            fieldsState = TEXT_FIELD_ERROR_TYPE.TELEPHONE_INVALID
          }
          break;
        default:
          break;
      }
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setEmployeeFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onEmployeeFieldBlur = (key: EmployeeFieldsKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const storeId = useAppSelector(state => state.Root.storeId)

  const getEmployee = async (id: string) => {
    const res = await apis.employee.getEmployee({employeeId: id}, {storeId})
    return res.code === API_CODES.SUCCESS && res.data || null
  }

  const initDetail = async (id?: string) => {
    setEmployeeFields({
      name: "",
      sex: undefined,
      age: undefined,
      telephoneNumber: "",
      employTime: undefined,
    })
    setEmployeeFieldsError({
      name: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
      sex: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
      telephoneNumber: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    })
    if (id) {
      const res = await getEmployee(id)
      if (res) {
        setEmployeeFields({
          name: res.name,
          sex: res.sex,
          age: res.age,
          telephoneNumber: res.telephoneNumber,
          employTime: dayjs(res.employTime).format('YYYY-MM-DDTHH:mm:ss'),
        })
      }
    }
  }

  React.useEffect(() => {
    if (props.open) {
      initDetail(props.id)
    }
  }, [props.open, props.id]);

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async () => {
    const validateList = ["name", "sex", "telephoneNumber"] as Array<EmployeeFieldsKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(employeeFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

    if (props.id) {
      const res = await apis.employee.updateEmployee({employeeId: props.id}, {storeId}, {
        name: employeeFields.name,
        age: employeeFields.age,
        sex: employeeFields.sex,
        employTime: new Date(employeeFields.employTime),
        telephoneNumber: employeeFields.telephoneNumber,
      })
  
        if (res.code === API_CODES.SUCCESS) {
          enqueueSnackbar("员工信息修改成功", {variant: "success"})
          props.onClose()
          props.onSuccess()
        } else {
          enqueueSnackbar("员工信息修改失败", {variant: "error"})
        }
    } else {
      const res = await apis.employee.createEmployee({storeId}, {
        name: employeeFields.name,
        age: employeeFields.age,
        sex: employeeFields.sex,
        employTime: new Date(employeeFields.employTime),
        telephoneNumber: employeeFields.telephoneNumber,
      })
  
        if (res.code === API_CODES.SUCCESS) {
          enqueueSnackbar("员工添加成功", {variant: "success"})
          props.onClose()
          props.onSuccess()
        } else {
          enqueueSnackbar("员工添加失败", {variant: "error"})
        }
    }
  }

  return  <Dialog
    open={props.open}
    onClose={props.onClose}
    scroll="paper"
    maxWidth="sm"
    fullWidth={true}
  >
  <DialogTitle>{props.id ? "修改员工信息": "添加员工"}</DialogTitle>
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
      <FormLabel>员工名称</FormLabel>
      <TextField
        placeholder="请输入员工名称"
        error={getFieldErrorState("name")}
        helperText={getFieldErrorTip("name")}
        fullWidth
        variant="standard"
        size="small"
        value={employeeFields["name"]}
        onChange={onEmployeeFieldChange("name")}
        onBlur={onEmployeeFieldBlur("name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel focused={false}>性别</FormLabel>
      <RadioGroup
        row
        value={employeeFields["sex"]}
        onChange={onEmployeeFieldChange("sex")}
      >
        <FormControlLabel value={EmployeeSex.MALE} control={<Radio />} label="男" />
        <FormControlLabel value={EmployeeSex.FEMALE} control={<Radio />} label="女" />
      </RadioGroup>
      {
        getFieldErrorState("sex") && <FormHelperText error={true}>{getFieldErrorTip("sex")}</FormHelperText>
      }
    </FormControl>
    <FormControl>
      <FormLabel>手机号</FormLabel>
      <TextField
        placeholder="请输入手机号"
        error={getFieldErrorState("telephoneNumber")}
        helperText={getFieldErrorTip("telephoneNumber")}
        fullWidth
        variant="standard"
        size="small"
        value={employeeFields["telephoneNumber"]}
        onChange={onEmployeeFieldChange("telephoneNumber")}
        onBlur={onEmployeeFieldBlur("telephoneNumber")}
      />
    </FormControl>
    <FormControl>
      <FormLabel>年龄</FormLabel>
      <TextField
        placeholder="请输入年龄"
        fullWidth
        variant="standard"
        size="small"
        value={employeeFields["age"]}
        onChange={onEmployeeFieldChange("age")}
      />
    </FormControl>
    <FormControl>
      <FormLabel>入职时间</FormLabel>
      <TextField
        placeholder="请选择入职时间"
        fullWidth
        variant="standard"
        size="small"
        type="datetime-local"
        value={employeeFields["employTime"]}
        onChange={onEmployeeFieldChange("employTime")}
      />
    </FormControl>
    
  </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={props.onClose}>取消</Button>
    <AsyncButton onClick={onSubmit}>保存</AsyncButton>
  </DialogActions>
</Dialog>
}


export default EditEmployee;
