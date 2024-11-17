import React from "react";
import apis from "../../../apis";
import { useDispatch } from "react-redux";
import API_CODES from "../../../utils/API_CODES";
import { Card, Box, Typography, CardContent } from "@mui/material";
import { RootActions } from "../../../stores/RootSlice";
import { BOTTOM_TAB } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const OrderList = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.ORDER))
  }, [])

  const [orderList, setOrderList] = React.useState([])

  const getOrderList = async () => {
    const res = await apis.order.getOrderList()
    if (res.code === API_CODES.SUCCESS) {
      setOrderList(res.data)
    }
  }

  React.useEffect(() => {
    getOrderList()
  }, []);

  const navigate = useNavigate();

  const openOrderDetail = (id) => () => {
    navigate("/order/" + id)
  }

  return <Box paddingBottom={1}>
    {orderList.map((orderItem) => {
      return (
        <Card key={orderItem.id} variant="outlined" sx={{marginTop: 1, marginX: 1}} onClick={openOrderDetail(orderItem.id)}>
          <CardContent sx={{paddingBottom: "16px !important"}}>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              下单时间 {dayjs(orderItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}
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
