import React from "react";
import { Box, Stack } from "@mui/material";
import EditFood from "./components/menus/EditFood";
import FoodTable from "./components/FoodTable";
import apis from "./../../../../apis";
import API_CODES from "./../../../../utils/API_CODES";
import DeleteFood from "./components/menus/DeleteFood";
import SoldOutFood from "./components/menus/SoldOutFood";

const FoodManage = () => {
  const [foodList, setFoodList] = React.useState([])

  const [selectedFoodIds, setSelectedFoodIds] = React.useState([])
  const onSetSelectedFoodIdsChanged = (e) => {
    setSelectedFoodIds(e)
  }

  const getFoodList = async () => {
    setSelectedFoodIds([]);
    const res = await apis.food.getFoodList();
    if (res.code === API_CODES.SUCCESS && res.data){
      setFoodList(res.data);
    }
  }

  React.useEffect(() => {
    getFoodList()
  }, [])

  const selectedFoodList = React.useMemo(() => foodList.filter(food => selectedFoodIds.includes(food.id)), [foodList, selectedFoodIds])

  return <Box sx={{
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }}>
    <Stack direction="row" spacing={2}>
      {selectedFoodList.length === 0 && <EditFood onDataUpdate={getFoodList}/>}
      {selectedFoodList.length === 1 && <EditFood data={selectedFoodList[0]} onDataUpdate={getFoodList}/>}
      {selectedFoodIds.length > 0 && <>
        <DeleteFood foodIds={selectedFoodIds} onDeleted={getFoodList} />
        <SoldOutFood foodIds={selectedFoodIds} onSoldOuted={getFoodList} soldOut={true}/>
        <SoldOutFood foodIds={selectedFoodIds} onSoldOuted={getFoodList} soldOut={false}/>
      </>}
    </Stack>
    <Box sx={{marginTop: 2, flexGrow: 1, width: "100%"}}>
      <FoodTable data={foodList} selectedIds={selectedFoodIds} onSelectedIdsChanged={onSetSelectedFoodIdsChanged}/>
    </Box>
  </Box>
}

export default FoodManage
