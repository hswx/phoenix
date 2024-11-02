import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginConainter from "./../../components/LoginConainter";
import { TEXT_FIELD_ERROR_TYPE } from "./../../utils/constants";
import { register } from "./../../apis/auth";
import API_CODES from "./../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export interface ReigsterFieldsData {
  userName: string;
  telephoneNumber: string;
  password: string;
  doublePassword: string;
  storeName: string;
  storeAddress: string;
}

type ReigsterFieldsDataKeys = keyof ReigsterFieldsData

export default function Register() {
  const [reigsterFields, setReigsterFields] = React.useState<ReigsterFieldsData>({
    userName: "",
    telephoneNumber: "",
    password: "",
    doublePassword: "",
    storeName: "",
    storeAddress: "",
  })

  const [reigsterFieldsError, setReigsterFieldsError] = React.useState<Record<ReigsterFieldsDataKeys, TEXT_FIELD_ERROR_TYPE>>({
    userName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    telephoneNumber: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    password: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    doublePassword: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    storeName: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    storeAddress: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const reigsterFieldsErrorTips: {
    [reigsterFieldsKey in (ReigsterFieldsDataKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    userName: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入姓名"
    },
    telephoneNumber: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入手机号码",
      [TEXT_FIELD_ERROR_TYPE.TELEPHONE_INVALID]: "手机号码不正确",
    },
    password: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入密码",
      [TEXT_FIELD_ERROR_TYPE.PASSWORD_LEN_8]: "密码长度至少8位",
    },
    doublePassword: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请再次输入密码",
      [TEXT_FIELD_ERROR_TYPE.DOUBLE_PASSWROD_NOT_COMPARE]: "两次密码不一致"
    },
    storeName: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入门店名称",
    },
    storeAddress: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入门店地址",
    }
  }

  const onReigsterFieldsChange = (key: ReigsterFieldsDataKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setReigsterFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setReigsterFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: ReigsterFieldsDataKeys) => (value: string) => {
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
        case "password":
          const length = value.length;
          if (length < 8) {
            fieldsState = TEXT_FIELD_ERROR_TYPE.PASSWORD_LEN_8
          }
          break;
        case "doublePassword":
          const passwordValue = reigsterFields.password
          if (value !== passwordValue) {
            fieldsState = TEXT_FIELD_ERROR_TYPE.DOUBLE_PASSWROD_NOT_COMPARE
          }
          break;
        default:
          break;
      }
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setReigsterFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onReigsterFieldsBlur = (key: ReigsterFieldsDataKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const getFieldsErrorState = (key: ReigsterFieldsDataKeys) => {
    return reigsterFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && reigsterFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldsErrorTip = (key: ReigsterFieldsDataKeys) => {
    const errorType = reigsterFieldsError[key]
    return reigsterFieldsErrorTips[key][errorType] || ""
  }

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const validateList = Object.keys(reigsterFields) as Array<ReigsterFieldsDataKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(reigsterFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }
    const body = {...reigsterFields}
    delete body.doublePassword
    const res = await register(body)
    if (res.code === API_CODES.SUCCESS) {
      enqueueSnackbar("注册成功", { variant: "success" })
      navigate("/login")
    } else if (res.code === API_CODES.REGISTER_TELEPHONE_REPEAT) {
      enqueueSnackbar("该手机号已被注册", { variant: "error" })
    }
  }

  return (
    <LoginConainter>
      <>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          注册
        </Typography>
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
            <FormLabel>姓名</FormLabel>
            <TextField
              placeholder="请输入姓名"
              error={getFieldsErrorState("userName")}
              helperText={getFieldsErrorTip("userName")}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["userName"]}
              onChange={onReigsterFieldsChange("userName")}
              onBlur={onReigsterFieldsBlur("userName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">手机号</FormLabel>
            <TextField
              placeholder="请输入手机号码"
              required
              error={getFieldsErrorState("telephoneNumber")}
              helperText={getFieldsErrorTip("telephoneNumber")}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["telephoneNumber"]}
              onChange={onReigsterFieldsChange("telephoneNumber")}
              onBlur={onReigsterFieldsBlur("telephoneNumber")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">密码</FormLabel>
            <TextField
              placeholder="请输入密码"
              required
              error={getFieldsErrorState("password")}
              helperText={getFieldsErrorTip("password")}
              fullWidth
              variant="standard"
              size="small"
              type="password"
              value={reigsterFields["password"]}
              onChange={onReigsterFieldsChange("password")}
              onBlur={onReigsterFieldsBlur("password")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">确认密码</FormLabel>
            <TextField
              placeholder="请再次输入密码"
              required
              error={getFieldsErrorState("doublePassword")}
              helperText={getFieldsErrorTip("doublePassword")}
              fullWidth
              variant="standard"
              size="small"
              type="password"
              value={reigsterFields["doublePassword"]}
              onChange={onReigsterFieldsChange("doublePassword")}
              onBlur={onReigsterFieldsBlur("doublePassword")}
            />
          </FormControl>
      
          <FormControl>
            <FormLabel htmlFor="password">门店名称</FormLabel>
            <TextField
              placeholder="请输入门店名称"
              required
              error={getFieldsErrorState("storeName")}
              helperText={getFieldsErrorTip("storeName")}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["storeName"]}
              onChange={onReigsterFieldsChange("storeName")}
              onBlur={onReigsterFieldsBlur("storeName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">门店地址</FormLabel>
            <TextField
              placeholder="请输入门店地址"
              required
              error={getFieldsErrorState("storeAddress")}
              helperText={getFieldsErrorTip("storeAddress")}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["storeAddress"]}
              onChange={onReigsterFieldsChange("storeAddress")}
              onBlur={onReigsterFieldsBlur("storeAddress")}
            />
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
          >
            注册
          </Button>
        </Box>
      </>
    </LoginConainter>
  );
}