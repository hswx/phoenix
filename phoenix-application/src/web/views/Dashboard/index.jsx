import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Outlet } from "react-router-dom";
import StoreMenu from "./components/StoreMenu";
import LoadingPage from "../../components/Loading";

const routes = [
  {
    name: "菜品管理",
    href: "/food-manage",
  },
  {
    name: "菜品分类",
    href: "/category-manage"
  },
  {
    name: "员工管理",
    href: "/employee-manage"
  },
];

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
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
        <Box sx={{paddingRight: 2}}>
          <StoreMenu />
        </Box>
        </Box>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 200,
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
          overflow: "hidden",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, overflow: "auto", flexGrow: 1 }}>
          <React.Suspense fallback={<LoadingPage />}>
            <Outlet />
          </React.Suspense>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
  