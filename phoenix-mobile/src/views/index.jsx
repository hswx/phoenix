import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { RootActions } from '../stores/RootSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BOTTOM_TAB } from '../utils/constants';

const Main = () => {
  const currentBottomTab = useSelector(state => state.Root.currentBottomTab)
  const dispatch = useDispatch()

  const navgate = useNavigate()

  const onCurrentBottomTabChange = (tabIndex) => {
    switch(tabIndex) {
      case BOTTOM_TAB.HOME:
        navgate("/")
        break;
      case BOTTOM_TAB.FOOD:
        navgate("/food")
        break;
      case BOTTOM_TAB.ORDER:
        navgate("/order/list")
        break;
      default:
        break;
    }
    dispatch(RootActions.setCurrentBottomTab(tabIndex))
  }

  return <Box sx={{height: '100%'}}>
    <Box sx={{height: "100dvh", paddingBottom: "56px", overflow: "auto"}}>
      <Outlet />
    </Box>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={currentBottomTab}
        onChange={(event, newValue) => {
          onCurrentBottomTabChange(newValue);
        }}
      >
        <BottomNavigationAction label="首页" icon={<HomeIcon />} />
        <BottomNavigationAction label="商品" icon={<ShoppingCartIcon />} />
        <BottomNavigationAction label="订单" icon={<ListAltIcon />} />
      </BottomNavigation>
    </Paper>
</Box>
}

export default Main
