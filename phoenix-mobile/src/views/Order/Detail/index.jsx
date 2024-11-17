import React from "react";
import { useParams } from "react-router-dom";
import apis from "../../../apis";
import { useDispatch } from "react-redux";
import API_CODES from "../../../utils/API_CODES";
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, IconButton } from "@mui/material";
import { getFoodDescription } from "../../../utils";
import { red } from '@mui/material/colors';
import { RootActions } from "../../../stores/RootSlice";
import { BOTTOM_TAB } from "../../../utils/constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from "dayjs";

const priceColor = red[500];

const OrderDetail = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.ORDER))
  }, [])

  const { id = "" } = useParams()

  const [orderDetail, setOrderDetail] = React.useState({})

  const getOrderDetail = async (params) => {
    const res = await apis.order.getOrderDetail(params)
    if (res.code === API_CODES.SUCCESS) {
      setOrderDetail(res.data)
    }
  }

  React.useEffect(() => {
    if (id) {
      getOrderDetail({orderId: id})
    }
  }, [id]);

  const {foodList, totalFoodPrice} = React.useMemo(() => {
    const foodList = orderDetail.foodList || []
    const totalFoodPrice = foodList.reduce((preV, curV) => {
      return preV + curV.count * curV.price
    }, 0)
    return {foodList, totalFoodPrice}
  }, [orderDetail])

  const onBack = () => {
    window.history.back()
  }

  return <Box paddingBottom={1}>
    <Box>
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
    <Typography padding={'8px'}>下单时间 {dayjs(orderDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
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
