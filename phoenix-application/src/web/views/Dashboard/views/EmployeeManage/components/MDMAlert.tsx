import React from "react";
import { Alert, Box, Button } from "@mui/material";
import { BACKEND_HOST, LOGIN_TOKEN_NAME } from "./../../../../../utils/constants";

const MDMAlert = () => {
  const onOpenMDMSignUpUrl = () => {
  }

  return <Box paddingBottom={1}>
  <Alert
    severity="warning"
    action={
      <Button color="warning" size="small" onClick={onOpenMDMSignUpUrl}>
        启用设备管理
      </Button>
    }
  ></Alert>
</Box>
}

export default MDMAlert;
