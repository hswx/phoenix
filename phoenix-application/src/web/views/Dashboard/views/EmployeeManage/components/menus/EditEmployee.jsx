import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { useSnackbar } from 'notistack';
import { SEX } from './../../../../../../utils/constants';
import apis from './../../../../../../apis';
import API_CODES from './../../../../../../utils/API_CODES';
import AsyncButton from './../../../../../../components/AsyncButton';
import RequiredTag from '../../../../../../components/RequiredTag';

const EditEmployee = (props) => {
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
        tip = "请输入员工姓名"
      }
      break;
    case "telephone": {
      if (value) {
        const regexp = /^1[3|4|5|7|8|9][0-9]\d{8}$/
        if (!regexp.test(value)) {
          state = true
          tip = "手机号码格式不正确"
        } else {
          state = false
          tip = ""
        }
      } else {
        state = true
        tip = "请输入手机号码"
      }
      break;
    }
    default:
      break;
  }
  return {state, tip}
}

const EditEmployeeDialog = (props) => {
  const [employeeFields, setEmployeeFields] = React.useState({
    name: "",
    sex: "",
    age: "",
    telephone: "",
  })

  const [employeeFieldsValid, setEmployeeFieldsValid] = React.useState({
    name: {
      state: undefined,
      tip: "",
    },
    telephone: {
      state: undefined,
      tip: "",
    },
  })

  const onEmployeeFieldChange = (key) => (event) => {
    setEmployeeFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setEmployeeFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: "",
      }
    }))
  }

  const onEmployeeFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value)
    setEmployeeFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
  }

  const getEmployee = async (id) => {
    const res = await apis.employee.getEmployee({employeeId: id})
    return res.code === API_CODES.SUCCESS && res.data || null
  }

  const initDetail = async (id) => {
    setEmployeeFields({
      name: "",
      sex: "",
      age: "",
      telephone: "",
    })
    setEmployeeFieldsValid({
      name: {
        state: undefined,
        tip: "",
      },
      telephone: {
        state: undefined,
        tip: "",
      },
    })
   
    if (id) {
      const res = await getEmployee(id)
      if (res) {
        setEmployeeFields({
          name: res.name,
          sex: res.sex,
          age: res.age,
          telephone: res.telephone,
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
    const validateList = ["name", "telephone"]
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(employeeFields[key]);
      if (validRes.state !== false) {
        validatePass = false
      }
    })

    if (!validatePass) {
      return
    }

    if (props.id) {
      const res = await apis.employee.updateEmployee({employeeId: props.id}, {
        name: employeeFields.name,
        age: employeeFields.age === "" ? undefined : employeeFields.age,
        sex: employeeFields.sex === "" ? undefined : employeeFields.sex,
        telephone: employeeFields.telephone,
      })
  
        if (res.code === API_CODES.SUCCESS) {
          enqueueSnackbar("员工信息修改成功", {variant: "success"})
          props.onClose()
          props.onSuccess()
        } else if (res.code === API_CODES.REGISTER_TELEPHONE_REPEAT) {
          enqueueSnackbar("员工手机号已存在", {variant: "error"})
        } else {
          enqueueSnackbar("员工信息修改失败", {variant: "error"})
        }
    } else {
      const res = await apis.employee.createEmployee({
        name: employeeFields.name,
        age: employeeFields.age === "" ? undefined : employeeFields.age,
        sex: employeeFields.sex === "" ? undefined : employeeFields.sex,
        telephone: employeeFields.telephone,
      })
  
        if (res.code === API_CODES.SUCCESS) {
          enqueueSnackbar("员工添加成功", {variant: "success"})
          props.onClose()
          props.onSuccess()
        } else if (res.code === API_CODES.REGISTER_TELEPHONE_REPEAT) {
          enqueueSnackbar("员工手机号已存在", {variant: "error"})
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
      <FormLabel>员工名称<RequiredTag /></FormLabel>
      <TextField
        placeholder="请输入员工名称"
        error={employeeFieldsValid["name"].state}
        helperText={employeeFieldsValid["name"].tip}
        fullWidth
        variant="standard"
        size="small"
        value={employeeFields["name"]}
        onChange={onEmployeeFieldChange("name")}
        onBlur={onEmployeeFieldBlur("name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel>手机号<RequiredTag /></FormLabel>
      <TextField
        placeholder="请输入手机号"
        error={employeeFieldsValid["telephone"].state}
        helperText={employeeFieldsValid["telephone"].tip}
        fullWidth
        variant="standard"
        size="small"
        value={employeeFields["telephone"]}
        onChange={onEmployeeFieldChange("telephone")}
        onBlur={onEmployeeFieldBlur("telephone")}
      />
    </FormControl>
    <FormControl>
      <FormLabel focused={false}>性别</FormLabel>
      <RadioGroup
        row
        value={employeeFields["sex"]}
        onChange={onEmployeeFieldChange("sex")}
      >
        <FormControlLabel value={SEX.MALE} control={<Radio />} label="男" />
        <FormControlLabel value={SEX.FEMALE} control={<Radio />} label="女" />
      </RadioGroup>
    </FormControl>
   
    <FormControl>
      <FormLabel>年龄</FormLabel>
      <TextField
        placeholder="请输入年龄"
        fullWidth
        variant="standard"
        size="small"
        type="number"
        value={employeeFields["age"]}
        onChange={onEmployeeFieldChange("age")}
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
