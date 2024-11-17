import React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginConainter from "../../components/LoginConainter";
import API_CODES from "../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import apis from "../../apis";
import RequiredTag from "../../components/RequiredTag";

const validateField = (key) => (value, doubleValue) => {
  let state = undefined
  let tip = ""
    switch(key) {
      case "userName": 
        if (value) {
          state = false
          tip = ""
        } else {
          state = true
          tip = "请输入姓名"
        }
        break;
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
      case "doublePassword":
        if (value) {
          if (value !== doubleValue) {
          state = true
          tip = "两次密码不一致"
          } else {
              state = false
          tip = ""
          }
        } else {
          state = true
          tip = "请再次输入密码"
        }
     break;
      case "storeName": 
        if (value) {
          state = false
          tip = ""
        } else {
          state = true
          tip = "请输入门店名称"
        }
        break
      case "storeAddress":
        if (value) {
          state = false
          tip = ""
        } else {
          state = true
          tip = "请输入门店地址"
        }
        break
      default:
        break;
    }
    return {state, tip}
}

export default function Register() {
  const [reigsterFields, setReigsterFields] = React.useState({
    userName: "",
    telephone: "",
    password: "",
    doublePassword: "",
    storeName: "",
    storeAddress: "",
  })

  const [reigsterFieldsValid, setReigsterFieldsValid] = React.useState({
    userName: {
      state: undefined,
      tip: "",
    },
    telephone: {
      state: undefined,
      tip: "",
    },
    password: {
      state: undefined,
      tip: "",
    },
    doublePassword: {
      state: undefined,
      tip: "",
    },
    storeName: {
      state: undefined,
      tip: "",
    },
    storeAddress: {
      state: undefined,
      tip: "",
    },
  })

  const onReigsterFieldChange = (key) => (event) => {
    setReigsterFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setReigsterFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: ""
      }
    }))
  }

  const onReigsterFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value, reigsterFields.password);
    setReigsterFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
    if (key === "password" && value && reigsterFields.doublePassword) {
      const doublePasswordValidateRes = validateField("doublePassword")(reigsterFields.doublePassword, value);
      setReigsterFieldsValid(prev => ({
        ...prev,
        "doublePassword": doublePasswordValidateRes
      }))
    }
  }

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const validateList = Object.keys(reigsterFields)
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(reigsterFields[key], reigsterFields.password);
      if (validRes.state !== false) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }
    const body = {...reigsterFields}
    delete body.doublePassword
    const res = await apis.auth.register(body)
    if (res.code === API_CODES.SUCCESS) {
      enqueueSnackbar("注册成功", { variant: "success" })
      await new Promise(reslove => {
        setTimeout(() => {
          reslove("")
        }, 1000)
      })
      navigate("/")
    } else if (res.code === API_CODES.REGISTER_TELEPHONE_REPEAT) {
      enqueueSnackbar("该手机号已被注册", { variant: "error" })
    } else {
      enqueueSnackbar("注册失败，请重试", { variant: "error" })
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
            <FormLabel>姓名<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入姓名"
              error={reigsterFieldsValid["userName"].state}
              helperText={reigsterFieldsValid["userName"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["userName"]}
              onChange={onReigsterFieldChange("userName")}
              onBlur={onReigsterFieldBlur("userName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">手机号<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入手机号码"
              required
              error={reigsterFieldsValid["telephone"].state}
              helperText={reigsterFieldsValid["telephone"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["telephone"]}
              onChange={onReigsterFieldChange("telephone")}
              onBlur={onReigsterFieldBlur("telephone")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>密码<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入密码"
              required
              error={reigsterFieldsValid["password"].state}
              helperText={reigsterFieldsValid["password"].tip}
              fullWidth
              variant="standard"
              size="small"
              type="password"
              value={reigsterFields["password"]}
              onChange={onReigsterFieldChange("password")}
              onBlur={onReigsterFieldBlur("password")}
            />
          </FormControl>

          <FormControl>
            <FormLabel>确认密码<RequiredTag /></FormLabel>
            <TextField
              placeholder="请再次输入密码"
              required
              error={reigsterFieldsValid["doublePassword"].state}
              helperText={reigsterFieldsValid["doublePassword"].tip}
              fullWidth
              variant="standard"
              size="small"
              type="password"
              value={reigsterFields["doublePassword"]}
              onChange={onReigsterFieldChange("doublePassword")}
              onBlur={onReigsterFieldBlur("doublePassword")}
            />
          </FormControl>
      
          <FormControl>
            <FormLabel>门店名称<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入门店名称"
              required
              error={reigsterFieldsValid["storeName"].state}
              helperText={reigsterFieldsValid["storeName"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["storeName"]}
              onChange={onReigsterFieldChange("storeName")}
              onBlur={onReigsterFieldBlur("storeName")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>门店地址<RequiredTag /></FormLabel>
            <TextField
              placeholder="请输入门店地址"
              required
              error={reigsterFieldsValid["storeAddress"].state}
              helperText={reigsterFieldsValid["storeAddress"].tip}
              fullWidth
              variant="standard"
              size="small"
              value={reigsterFields["storeAddress"]}
              onChange={onReigsterFieldChange("storeAddress")}
              onBlur={onReigsterFieldBlur("storeAddress")}
            />
          </FormControl>
          <AsyncButton
            fullWidth
            variant="contained"
            onClick={onSubmit}
          >
            注册
          </AsyncButton>
        </Box>
      </>
    </LoginConainter>
  );
}