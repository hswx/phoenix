import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoadingPage from "../../components/Loading";
import apis from "../../apis";
import API_CODES from "../../utils/API_CODES";
import { BUSINESS_ID_TOKEN_NAME, LOGIN_TOKEN_NAME } from "../../utils/constants";
import { useSnackbar } from "notistack";

const Auth = () => {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const auth = async (token) => {
    const res = await apis.auth.auth({token});
    if (res.code === API_CODES.SUCCESS && res.data) {
      const {token, bussinessId} = res.data;
      localStorage.setItem(LOGIN_TOKEN_NAME, token);
      localStorage.setItem(BUSINESS_ID_TOKEN_NAME, bussinessId);
      navigate("/")
    } else {
      enqueueSnackbar("登录失败", {variant: "error"})
    }
  }

  React.useEffect(() => {
    const token = searchParams.get("token");
    auth(token)
  }, [])

  return <LoadingPage />
}

export default Auth
