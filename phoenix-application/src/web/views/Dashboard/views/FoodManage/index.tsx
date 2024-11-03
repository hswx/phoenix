import React from "react";
import { Box, Button, Divider, Stack } from "@mui/material";
import EditFood from "./components/menus/EditFood";
import FoodTable from "./components/FoodTable";
import apis from "./../../../../apis";
import { useAppSelector } from "./../../../../stores";
import API_CODES from "./../../../../utils/API_CODES";

export type Food = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  soldOut: boolean;
  createdAt: Date;
}

const FoodManage = () => {
  const [foodList, setFoodList] = React.useState<Food[]>([])

  const storeId = useAppSelector(state => state.Root.storeId)

  const getFoodList = async () => {
    const res = await apis.food.getFoodList(storeId);
    if (res.code === API_CODES.SUCCESS && res.data){
      setFoodList(res.data);
    }
  }

  React.useEffect(() => {
    getFoodList()
  }, [])

  const [selectedFoodIds, setSelectedFoodIds] = React.useState<string[]>([])
  const onSetSelectedFoodIdsChanged = (e: string[]) => {
    setSelectedFoodIds(e)
  }

  const selectedFoodList = React.useMemo(() => foodList.filter(food => selectedFoodIds.includes(food.id)), [foodList, selectedFoodIds])
  const onSelectedFoodUpate = (food: Partial<Food>) => {
    setFoodList(prev => {
      const list = [...prev];
      const index = list.findIndex(item => item.id === food.id)
      const newItem = {
        ...list[index],
        ...food,
      }
      list.splice(index, 1, newItem)
      return list
    })
  }

  return <Box sx={{
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }}>
    <Stack direction="row" spacing={2}>
      {selectedFoodList.length === 0 && <EditFood onDataUpdate={getFoodList}/>}
      {selectedFoodList.length === 1 && <EditFood data={selectedFoodList[0]} onDataUpdate={onSelectedFoodUpate}/>}
    </Stack>
    <Box sx={{marginTop: 2, flexGrow: 1, width: "100%"}}>
      <FoodTable data={foodList} selectedIds={selectedFoodIds} onSelectedIdsChanged={onSetSelectedFoodIdsChanged}/>
    </Box>
  </Box>
}

export default FoodManage
