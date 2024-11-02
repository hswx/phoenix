import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useNavigate } from "react-router-dom";
import { Divider, Grid2, IconButton, MenuItem, MenuList, Popover } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import apis from "./../../apis";
import API_CODES from "./../../utils/API_CODES";
import { useAppDispatch } from "./../../stores";
import { RootActions } from "./../../stores/RootSlice";
import { useSnackbar } from "notistack";
import { LOGIN_TOKEN_NAME } from "./../../utils/constants";
import UpdateStoreDialog, { StoreFieldsData } from "./components/UpdateStoreDialog";

const drawerWidth = 200;
const routes = [
  {
    name: "员工管理",
    href: "/",
  },
];

export default function Dashboard() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchorEl(null)
  }

  const [storeInfo, setStoreInfo] = React.useState({
    name: "",
    address: "",
    ownerName: "",
  })

  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();
  
  const getStoreInfo = async () => {
    const res = await apis.store.getStoreInfo()
    console.log(1001, res)
    if (res.code === API_CODES.SUCCESS && res.data) {
      setStoreInfo({
        name: res.data.name,
        address: res.data.address,
        ownerName: res.data.ownerName,
      })
      dispatch(RootActions.setStoreId(res.data.id))
    } else {
      enqueueSnackbar("查询门店信息异常", {variant: "error"})
    }
  }

  React.useEffect(() => {
    getStoreInfo()
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(LOGIN_TOKEN_NAME)
    navigate("/login")
  }

  const [updateStoreDialogVisible, setUpdateStoreDialogVisible] = React.useState(false);
  const openUpdateStoreDialog = () => {
    closeMenu()
    setUpdateStoreDialogVisible(true)
  };
  const closeUpdateStoreDialog = () => setUpdateStoreDialogVisible(false);

  const storeFieldsData: StoreFieldsData = React.useMemo(() => ({
    ownerName: storeInfo.ownerName,
    storeName: storeInfo.name,
    storeAddress: storeInfo.address,
  }), [storeInfo]);

  const setStoreFieldsData = React.useCallback((e: StoreFieldsData) => {
    setStoreInfo({
      ownerName: e.ownerName,
      name: e.storeName,
      address: e.storeAddress,
    })
  }, [])

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            PHOENIX
          </Typography>
        </Toolbar>
        <IconButton
          size="large"
          onClick={openMenu}
          color="inherit"
          sx={{marginRight: 2}}
        >
          <MenuIcon />
        </IconButton>
        <Popover
          open={Boolean(menuAnchorEl)}
          anchorEl={menuAnchorEl}
          onClose={closeMenu}
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
        <UpdateStoreDialog open={updateStoreDialogVisible} onClose={closeUpdateStoreDialog} storeInfo={storeFieldsData} setStoreInfo={setStoreFieldsData}/>
        </Box>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {routes.map((item, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton href={"/dashboard" + item.href}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, overflow: "auto", flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
