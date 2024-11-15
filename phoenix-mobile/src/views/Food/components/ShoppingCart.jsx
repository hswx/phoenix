import React from "react";
import { Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { red, amber } from '@mui/material/colors';
import { FoodActions } from "../store";
import { getFoodDescription } from "../../../utils";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apis from "../../../apis";
import API_CODES from "../../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const priceColor = red[500];
const operateColor = amber[500];
const shoppingCartColor = amber[500];

const ShoppingCart = () => {
  const shoppingCart = useSelector(state => state.Food.shoppingCart);

  const foodList = React.useMemo(() => Object.values(shoppingCart), [shoppingCart]);

  const {totalFoodCount, totalFoodPrice} = React.useMemo(() => {
    let count = 0
    let price = 0
    foodList.forEach(item => {
      count = count + item.count
      price = price + item.count * item.food.price
    })
    return {
      totalFoodCount: count,
      totalFoodPrice: price,
    }
  }, [foodList])

  const [foodListVisible, setFoodListVisible] = React.useState(false);

  const dispatch = useDispatch()
  const addFood = (food) => () => {
    dispatch(FoodActions.addFood(food))
  }
  const removeFood = (food) => () => {
    dispatch(FoodActions.removeFood(food))
  }

  const employeeId = useSelector(state => state.Root.employeeId)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const onCreateOrder = async () => {
    const data = {
      employeeId,
      foodList: foodList.map(item => ({
        count: item.count,
        ...item.food,
      }))
    }
    const res = await apis.order.createOrder(data)
    const orderId = res.code === API_CODES.SUCCESS && res.data
    if (orderId) {
      navigate(`/order/${orderId}`)
    } else {
      enqueueSnackbar("下单失败，请重试", {variant: "error"})
    }
  }

  return <><Box sx={{height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: '8px'}}>
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <IconButton onClick={() => setFoodListVisible(true)} disabled={totalFoodCount <= 0}>
        <ShoppingCartIcon sx={{color: shoppingCartColor}}/>
      </IconButton>
      <Typography>共{totalFoodCount || 0}个菜</Typography>
    </Box>
    <Typography>总价 {totalFoodPrice || 0}</Typography>
    <Button variant="contained" size="small" onClick={onCreateOrder} disabled={totalFoodCount <= 0}>
      立即下单
    </Button>
  </Box>
  <Drawer
    anchor='bottom'
    open={foodListVisible}
    onClose={() => setFoodListVisible(false)}
  >
    <Box display={'flex'} flexDirection={"row-reverse"}>
      <IconButton onClick={() => setFoodListVisible(false)} sx={{marginRight: "8px"}}>
        <HighlightOffIcon />
      </IconButton>
    </Box>
      <List sx={{ width: '100%', backgroundColor: 'background.paper' }}>
        {
          foodList.map((item, index) => {
          const foodItem = item.food
          return <React.Fragment key={foodItem.id}>
            {index !== 0 && <Divider />}
            <ListItem
              alignItems="flex-start"
              sx={{padding: '0 8px'}}
              secondaryAction={
                <>
                  <Typography color={priceColor} textAlign='right' paddingRight={1}>{foodItem.price * item.count || 0}</Typography>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <IconButton sx={{p: 0}} onClick={removeFood(foodItem)}>
                      <RemoveCircleIcon sx={{color: operateColor}}/>
                    </IconButton>
                    <Typography width={'24px'} textAlign='center'>{item.count || 0}</Typography>
                    <IconButton sx={{p: 0}} onClick={addFood(foodItem)}>
                      <AddCircleIcon sx={{color: operateColor}}/>
                    </IconButton>
                  </Box>
                </>
              }>
              <ListItemAvatar>
                <Avatar src={foodItem.imgPath} sx={{borderRadius: 0}}/>
              </ListItemAvatar>
              <ListItemText
                primary={foodItem.name}
                secondary={getFoodDescription(foodItem.cuisine, foodItem.flavor)}
              />
            </ListItem>
          </React.Fragment>})
        }
      </List>
  </Drawer>
 </>
}

export default ShoppingCart
