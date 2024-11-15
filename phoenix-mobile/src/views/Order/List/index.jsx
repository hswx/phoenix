import React from "react";
import { useParams } from "react-router-dom";
import apis from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import API_CODES from "../../../utils/API_CODES";
import { Card, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, CardContent } from "@mui/material";
import { red, amber } from '@mui/material/colors';
import { RootActions } from "../../../stores/RootSlice";
import { BOTTOM_TAB } from "../../../utils/constants";

const OrderList = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.ORDER))
  }, [])

  const [orderList, setOrderList] = React.useState([])

  const employeeId = useSelector(state => state.Root.employeeId)

  const getOrderList = async (query) => {
    const res = await apis.order.getOrderList(query)
    if (res.code === API_CODES.SUCCESS) {
      setOrderList(res.data)
    }
  }

  React.useEffect(() => {
    if (employeeId) {
      getOrderList({employeeId})
    }
  }, [employeeId]);

  return <Box paddingBottom={7} height={'100vh'} overflow={'auto'}>
    {orderList.map((orderItem, index) => {
      return (
        <Card key={orderItem.id} variant="outlined" sx={{marginTop: 1, marginX: 1}}>
          <CardContent sx={{paddingBottom: "16px !important"}}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              下单时间 {orderItem.createdAt}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'auto', gap: 0.5}}>
                {
                  orderItem.imgs.map((item, index) => <Box
                    key={index}
                    height="50px"
                    width="50px"
                    overflow="hidden"
                    textAlign="center"
                    flexShrink="0"
                    display="flex"
                    justifyContent="center"
                  ><img
                    src={item}
                    loading="lazy"
                    height="50px"
                  /></Box>)
                }
              </Box>
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, paddingLeft: 2, flexShrink: 0 }}>
                总价 {orderItem.totalPrice || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    })}
    <Typography variant="body2" sx={{paddingY: 1, textAlign: 'center'}}>已经到底啦</Typography>
  </Box>
};

export default OrderList;
