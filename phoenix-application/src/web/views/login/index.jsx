import React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginConainter from "../../components/LoginConainter";
import { BUSINESS_ID_TOKEN_NAME, LOGIN_TOKEN_NAME } from "../../utils/constants";
import API_CODES from "../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import { Link } from "@mui/material";
import apis from "../../apis";
import RequiredTag from "../../components/RequiredTag";

const validateField = (key) => (value) => {
  let state = undefined
  let tip = ""
    switch(key) {
      case "telephone":
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
      case "password":
        if (value) {
          const length = value.length;
          if (length < 8) {
            state = true
            tip = "密码长度至少8位"
          } else {
state = false
            tip = ""
          }
        } else {
          state = true
          tip = "请输入密码"
        }
        break;
      default:
        break;
    }
    return {state, tip}
}

export default function Login() {
  const [loginFields, setLoginFields] = React.useState({
    telephone: "",
    password: "",
  })

  const [loginFieldsValid, setLoginFieldsValid] = React.useState({
    telephone: {
      state: undefined,
      tip: "",
    },
    password: {
      state: undefined,
      tip: "",
    }
  })

  const onLoginFieldChange = (key) => (event) => {
    setLoginFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setLoginFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: ""
      }
    }))
  }

  const onLoginFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value)
    setLoginFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
  }

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const validateList = Object.keys(loginFieldsValid)
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(loginFields[key]);
      if (validRes.state !== false) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }
    const res = await apis.auth.login(loginFields)
    if (res.code === API_CODES.SUCCESS && res.data) {
      const {token, bussinessId} = res.data
      localStorage.setItem(LOGIN_TOKEN_NAME, token);
      localStorage.setItem(BUSINESS_ID_TOKEN_NAME, bussinessId);
      navigate("/dashboard")
    } else if (res.code === API_CODES.LOGIN_ACCOUNT_ERROR) {
      enqueueSnackbar("账号密码错误", { variant: "error" })
    } else if (res.code === API_CODES.STORE_UNFIND) {
      enqueueSnackbar("找不到门店", { variant: "error" })
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
            <FormLabel htmlFor="email">手机号<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入手机号码"
              required
              error={loginFieldsValid["telephone"].state}
              helperText={loginFieldsValid["telephone"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={loginFields["telephone"]}
              onChange={onLoginFieldChange("telephone")}
              onBlur={onLoginFieldBlur("telephone")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>密码<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入密码"
              required
              error={loginFieldsValid["password"].state}
              helperText={loginFieldsValid["password"].tip}
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