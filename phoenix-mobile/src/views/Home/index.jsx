import React from 'react'
import { ImageList, ImageListItem, ImageListItemBar, Paper, Box } from '@mui/material'
import apis from '../../apis'
import API_CODES from '../../utils/API_CODES'
import { useDispatch } from 'react-redux'
import { BOTTOM_TAB } from '../../utils/constants'
import { RootActions } from '../../stores/RootSlice'
import { getFoodDescription } from '../../utils'
import LionGame from './components/LionGame'

const Home = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(RootActions.setCurrentBottomTab(BOTTOM_TAB.HOME))
  }, [])

  const [foodList, setFoodList] = React.useState([]);

  const getFoodList = async () => {
    const res = await apis.food.getFoodList()
    const list = res.code === API_CODES.SUCCESS && res.data || []
    setFoodList(list);
  };

  React.useEffect(() => {
    getFoodList()
  }, [])

  return <Box>
    <Box>
      <LionGame />
    </Box>
      <ImageList variant="masonry" cols={2} gap={8} sx={{paddingX: 1, paddingBottom: 1}}>
  {foodList.map((item) => 
   {
    return <Paper key={item.id}>
    <ImageListItem >
      <img
        src={item.imgPath}
        loading="lazy"
        style={{borderTopLeftRadius: "8px", borderTopRightRadius: "8px"}}
      />
      <ImageListItemBar
        title={item.name}
        subtitle={getFoodDescription(item.cuisine, item.flavor)}
        position="below"
        sx={{paddingX: 1}}
      />
    </ImageListItem>
    </Paper>}
  )}
</ImageList>
    </Box>
}

export default Home
