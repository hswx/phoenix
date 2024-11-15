import React from "react";
import { Box, Stack } from "@mui/material";
import apis from "../../../../apis";
import { useAppSelector } from "../../../../stores";
import API_CODES from "../../../../utils/API_CODES";
import EditCateogry from "./components/menus/EditCategory";
import { CategoryType } from "../../../../utils/constants";
import CategoryTable from "./components/CategoryTable";
import DeleteCategory from "./components/menus/DeleteCategory";

export type Category = {
  id: string;
  name: string;
  ruleType: CategoryType;
  foodCount: number;
  foodList?: string[];
  query?: string;
  createdAt: Date;
}

const CategoryManage = () => {
  const [categoryList, setCategoryList] = React.useState<Category[]>([])

  const storeId = useAppSelector(state => state.Root.storeId)

  const getCategoryList = async () => {
    const res = await apis.category.getCategoryList({storeId});
    if (res.code === API_CODES.SUCCESS && res.data){
      setCategoryList(res.data);
    }
  }

  React.useEffect(() => {
    getCategoryList()
  }, [])

  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([])
  const onSetSelectedCategoryIdsChanged = (e: string[]) => {
    setSelectedCategoryIds(e)
  }

  return <Box sx={{
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }}>
    <Stack direction="row" spacing={2}>
      {selectedCategoryIds.length === 0 && <EditCateogry onSuccess={getCategoryList}/>}
      {selectedCategoryIds.length === 1 && <EditCateogry id={selectedCategoryIds[0]} onSuccess={getCategoryList}/>}
      {selectedCategoryIds.length > 0 && <>
        <DeleteCategory categoryIds={selectedCategoryIds} onDeleted={getCategoryList} />
      </>}
    </Stack>
    <Box sx={{marginTop: 2, flexGrow: 1, width: "100%"}}>
      <CategoryTable data={categoryList} selectedIds={selectedCategoryIds} onSelectedIdsChanged={onSetSelectedCategoryIdsChanged}/>
    </Box>
  </Box>
}

export default CategoryManage