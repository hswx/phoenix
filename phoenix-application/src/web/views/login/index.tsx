import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginConainter from "./../../components/LoginConainter";
import { LOGIN_TOKEN_NAME, TEXT_FIELD_ERROR_TYPE } from "./../../utils/constants";
import { login } from "./../../apis/auth";
import API_CODES from "./../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AsyncButton from "./../../components/AsyncButton";
import { Link } from "@mui/material";

export interface LoginFieldsData {
  telephoneNumber: string;
  password: string;
}

type LoginFieldsDataKeys = keyof LoginFieldsData

export default function Login() {
  const [loginFields, setLoginFields] = React.useState<LoginFieldsData>({
    telephoneNumber: "",
    password: "",
  })

  const [loginFieldsError, setLoginFieldsError] = React.useState<Record<LoginFieldsDataKeys, TEXT_FIELD_ERROR_TYPE>>({
    telephoneNumber: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    password: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const loginFieldsErrorTips: {
    [reigsterFieldsKey in (LoginFieldsDataKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    telephoneNumber: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入手机号码",
      [TEXT_FIELD_ERROR_TYPE.TELEPHONE_INVALID]: "手机号码不正确",
    },
    password: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入密码",
      [TEXT_FIELD_ERROR_TYPE.PASSWORD_LEN_8]: "密码长度至少8位",
    },
  }

  const onLoginFieldChange = (key: LoginFieldsDataKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setLoginFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: LoginFieldsDataKeys) => (value: string) => {
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
        default:
          break;
      }
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setLoginFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onLoginFieldBlur = (key: LoginFieldsDataKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const getFieldErrorState = (key: LoginFieldsDataKeys) => {
    return loginFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && loginFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldErrorTip = (key: LoginFieldsDataKeys) => {
    const errorType = loginFieldsError[key]
    return loginFieldsErrorTips[key][errorType] || ""
  }

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const validateList = Object.keys(loginFields) as Array<LoginFieldsDataKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(loginFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }
    const res = await login(loginFields)
    if (res.code === API_CODES.SUCCESS && res.data?.token) {
      localStorage.setItem(LOGIN_TOKEN_NAME, res.data.token);
      navigate("/dashboard")
    } else if (res.code === API_CODES.LOGIN_ACCOUNT_ERROR) {
      enqueueSnackbar("账号密码错误", { variant: "error" })
    } else {
      enqueueSnackbar("登录失败，请重试", { variant: "error" })
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
          登录
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
            <FormLabel htmlFor="email">手机号</FormLabel>
            <TextField
              placeholder="请输入手机号码"
              required
              error={getFieldErrorState("telephoneNumber")}
              helperText={getFieldErrorTip("telephoneNumber")}
              fullWidth
              variant="standard"
              size="small"
              value={loginFields["telephoneNumber"]}
              onChange={onLoginFieldChange("telephoneNumber")}
              onBlur={onLoginFieldBlur("telephoneNumber")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">密码</FormLabel>
            <TextField
              placeholder="请输入密码"
              required
              error={getFieldErrorState("password")}
              helperText={getFieldErrorTip("password")}
              fullWidth
              variant="standard"
              size="small"
              type="password"
              value={loginFields["password"]}
              onChange={onLoginFieldChange("password")}
              onBlur={onLoginFieldBlur("password")}
            />
          </FormControl>
        
          <AsyncButton
            fullWidth
            variant="contained"
            onClick={onSubmit}
          >
            登录
          </AsyncButton>
          <Typography sx={{ textAlign: 'center' }}>
            没有账号？
            <span>
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                注册
              </Link>
            </span>
          </Typography>
        </Box>
      </>
    </LoginConainter>
  );
}