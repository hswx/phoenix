import React from "react";
import { Divider, Grid2, IconButton, MenuItem, MenuList, Popover } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { LOGIN_TOKEN_NAME } from "../../../utils/constants";
import apis from "../../../apis";
import API_CODES from "../../../utils/API_CODES";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UpdateStoreDialog from "./UpdateStoreDialog";

const StoreMenu = () => {
  const [storePopoverAnchorEl, setStorePopoverAnchorEl] = React.useState(null);
  const openStorePopover = (event) => {
    setStorePopoverAnchorEl(event.currentTarget)
  }
  const closeStorePopover = () => {
    setStorePopoverAnchorEl(null)
  }

  const [updateStoreDialogVisible, setUpdateStoreDialogVisible] = React.useState(false);
  const openUpdateStoreDialog = () => {
    closeStorePopover()
    setUpdateStoreDialogVisible(true)
  };
  const closeUpdateStoreDialog = () => setUpdateStoreDialogVisible(false);
  
  const [storeInfo, setStoreInfo] = React.useState({
    name: "",
    address: "",
    ownerName: "",
  })

  const getStoreInfo = async () => {
    try {
      const res = await apis.store.getStoreInfo()
      if (res.code === API_CODES.SUCCESS && res.data) {
        setStoreInfo({
          name: res.data.name,
          address: res.data.address,
          ownerName: res.data.ownerName,
        })
      }
    }catch(e){
      console.log(1001, e)
    }
 
  }

  React.useEffect(() => {
    getStoreInfo()
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(LOGIN_TOKEN_NAME)
    navigate("/")
  }


  return <>
  <IconButton
  size="large"
  onClick={openStorePopover}
  color="inherit"
>
  <AccountCircleIcon />
</IconButton>
<Popover
  open={Boolean(storePopoverAnchorEl)}
  anchorEl={storePopoverAnchorEl}
  onClose={closeStorePopover}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
>
  <Grid2
    container 
    sx={{
      paddingX: 2,
      paddingY: 2,
      maxWidth: '320px',
      overflowWrap: "anywhere"
    }}
    columnSpacing={2}
    rowSpacing={1.5}
  >
    <Grid2 size={4}>
      店长：
    </Grid2>
    <Grid2 size={8}>
      {storeInfo.ownerName || ""}
    </Grid2>
    <Grid2 size={4}>
      门店名称：
    </Grid2>
    <Grid2 size={8}>
      {storeInfo.name || ""}
    </Grid2>
    <Grid2 size={4}>
      门店地址：
    </Grid2>
    <Grid2 size={8}>
      {storeInfo.address || ""}
    </Grid2>
  </Grid2>
  <Divider />
  <MenuList>
    <MenuItem onClick={openUpdateStoreDialog}>修改资料</MenuItem>
    <MenuItem onClick={logout}>注销</MenuItem>
  </MenuList>
</Popover>
<UpdateStoreDialog open={updateStoreDialogVisible} onClose={closeUpdateStoreDialog} storeInfo={storeInfo} setStoreInfo={setStoreInfo}/>
</>
}

export default StoreMenu
