import React from "react";
import { Avatar, Box, Divider, Drawer, Grid2, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import apis from "../../../apis";
import API_CODES from "../../../utils/API_CODES";
import { useDispatch, useSelector } from "react-redux";
import { getFoodDescription } from "../../../utils";
import { Link as ScrollLink, Element as ScrollElement } from 'react-scroll';
import { red, amber } from '@mui/material/colors';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { FoodActions } from "../store";

const priceColor = red[500];
const operateColor = amber[500];

const FoodList = () => {
  const [foodFllist, setFoodllist] = React.useState([]);
  const [activeCategoryId, setActiveCategoryId] = React.useState(undefined);

  const initFoodList = async () => {
    const res = await apis.food.getFoodFullist()
    const foodFllist = res.code === API_CODES.SUCCESS && res.data;
    if (foodFllist.length > 0) {
      setFoodllist(foodFllist)
      setActiveCategoryId(foodFllist[0].id)
    }
  }

  React.useEffect(() => {
    initFoodList()
  }, [])

  const onCategoryChange = (id) => () => {
    setActiveCategoryId(id)
  }

  const shoppingCart = useSelector(state => state.Food.shoppingCart)
  const dispatch = useDispatch()
  const addFood = (food) => () => {
    dispatch(FoodActions.addFood(food))
  }
  const removeFood = (food) => () => {
    dispatch(FoodActions.removeFood(food))
  }

  return (
    <Grid2 container flexGrow={1} overflow='hidden'>
      <Grid2 size={4} height={'100%'} overflow={'auto'}>
        <Drawer
          variant="permanent"
          anchor="left"
          PaperProps={{sx: {position: 'relative'}}}
          sx={{height: '100%'}}
        >
        <List disablePadding>
          {
            foodFllist.map(item => (
              <ScrollLink
                containerId="containerElement"
                to={item.id}
                spy={true}
                key={item.id}
                onSetActive={onCategoryChange(item.id)}
              >
              <ListItemButton selected={activeCategoryId === item.id}>
                <ListItemText primary={item.name}/>
              </ListItemButton>
              <Divider />
              </ScrollLink>))
          }
        </List>
        </Drawer>
      </Grid2>
      <Grid2 size={8} height={'100%'}  bgcolor={'rgba(0, 0, 0, 0.04)'}>
        <ScrollElement
          id="containerElement"
          style={{
            position: "relative",
            height: "100%",
            overflow: "scroll",
          }}
        >
        {
          foodFllist.map(categoryItem => (
            <ScrollElement name={categoryItem.id} key={categoryItem.id}>
              <Typography variant="h6" paddingX={1}>
                {categoryItem.name}
              </Typography>
              <List sx={{ width: '100%', backgroundColor: 'background.paper' }}>
                {
                  categoryItem.foodList.map((foodItem, index) => {
                  return <React.Fragment key={foodItem.id}>
                    {index !== 0 && <Divider />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{padding: '0 8px'}}
                      secondaryAction={
                        <>
                          <Typography color={priceColor} textAlign='right' paddingRight={1}>{foodItem.price || 0}</Typography>
                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <IconButton sx={{p: 0}} onClick={removeFood(foodItem)}>
                              <RemoveCircleIcon sx={{color: operateColor}}/>
                            </IconButton>
                            <Typography width={'24px'} textAlign='center'>{shoppingCart[foodItem.id]?.count || 0}</Typography>
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
            </ScrollElement>
          ))
        }
        <Box height="100%">
          <Typography variant="body2" sx={{paddingTop: 1, textAlign: 'center'}}>已经到底啦</Typography>
        </Box>
        </ScrollElement>
      </Grid2>
    </Grid2>
  );
};

export default FoodList;
