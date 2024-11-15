import React from "react";
import { useParams } from "react-router-dom";
import apis from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import API_CODES from "../../../utils/API_CODES";
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { getFoodDescription } from "../../../utils";
import { red, amber } from '@mui/material/colors';
import { RootActions } from "../../../stores/RootSlice";
import { BOTTOM_TAB } from "../../../utils/constants";

const priceColor = red[500];

const OrderDetail = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.ORDER))
  }, [])

  const { id = "" } = useParams()

  const [orderDetail, setOrderDetail] = React.useState({})

  const employeeId = useSelector(state => state.Root.employeeId)

  const getOrderDetail = async (params, query) => {
    const res = await apis.order.getOrderDetail(params, query)
    if (res.code === API_CODES.SUCCESS) {
      setOrderDetail(res.data)
    }
  }

  React.useEffect(() => {
    if (id && employeeId) {
      getOrderDetail({orderId: id}, {employeeId})
    }
  }, [id, employeeId]);

  const {foodList, totalFoodPrice} = React.useMemo(() => {
    const foodList = orderDetail.foodList || []
    const totalFoodPrice = foodList.reduce((preV, curV) => {
      return preV + curV.count * curV.price
    }, 0)
    return {foodList, totalFoodPrice}
  }, [orderDetail])

  return <Box paddingBottom={7} height={'100vh'} overflow={'auto'}>
    <Typography padding={'8px'}>下单时间 {orderDetail.createdAt}</Typography>
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 8px 8px'}}>
      <Typography>共{foodList.length || 0}个菜</Typography>
      <Typography>总价 {totalFoodPrice || 0}</Typography>
    </Box>
    <List sx={{ width: "100%", backgroundColor: "background.paper" }}>
      {foodList.map((foodItem, index) => {
        return (
          <React.Fragment key={foodItem.id}>
            {index !== 0 && <Divider />}
            <ListItem
              alignItems="flex-start"
              sx={{ padding: "0 8px" }}
              secondaryAction={
                <>
                  <Typography
                    color={priceColor}
                    textAlign="right"
                  >
                    单价 {foodItem.price || 0}
                  </Typography>
                  <Typography textAlign="right">
                    数量 {foodItem.count || 0}
                  </Typography>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar src={foodItem.imgPath} sx={{ borderRadius: 0 }} />
              </ListItemAvatar>
              <ListItemText
                primary={foodItem.name}
                secondary={getFoodDescription(
                  foodItem.cuisine,
                  foodItem.flavor
                )}
              />
            </ListItem>
          </React.Fragment>
        );
      })}
    </List>
  </Box>
};

export default OrderDetail;
