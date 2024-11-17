import React from "react"
import { AppBar, Typography } from "@mui/material";
import apis from "../../../apis";
import API_CODES from "../../../utils/API_CODES";

const StoreBar = () => {
  const [storeInfo, setStoreInfo] = React.useState({});

  const getStoreInfo = async () => {
    const res = await apis.store.getStoreInfo()
    if (res.code === API_CODES.SUCCESS && res.data) {
      setStoreInfo(res.data)
    }
  }

  React.useEffect(() => {
    getStoreInfo()
  }, []);

  return <AppBar position="static" sx={{p: 1}}>
    <Typography variant="h5">
      {storeInfo.name || <>&nbsp;</>}
    </Typography>
    <Typography variant="subtitle1">
      地址: {storeInfo.address || <>&nbsp;</>}
    </Typography>
  </AppBar>
}

export default StoreBar;
