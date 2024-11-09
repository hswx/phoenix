import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Category } from "..";
import dayjs from "dayjs";
import { CategoryType } from "./../../../../../utils/constants";

const columns: GridColDef<Category>[] = [
  { field: "name", headerName: "分类名称", width: 240 },
  {
    field: "ruleType",
    headerName: "分类类型",
    type: "number",
    width: 100,
    valueGetter: (value) => {
      switch (value) {
        case CategoryType.DYNAMIC_CATEGORY:
          return "动态菜品"
        case CategoryType.SELECTED_CATEGORY:
          return "固定菜品"
        default:
          return ""
      }
    }
  },
  {
    field: "foodCount",
    headerName: "菜品数量",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "创建时间",
    width: 200,
    renderCell: (item) => {
      return dayjs(item.value).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];

type CategoryTableProps = {
  data: Category[];
  selectedIds: string[];
  onSelectedIdsChanged: (e: string[]) => void;
};

const CategoryTable = (props: CategoryTableProps) => {
  return (
    <DataGrid
      rows={props.data}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10]}
      checkboxSelection
      rowSelectionModel={props.selectedIds}
      onRowSelectionModelChange={props.onSelectedIdsChanged}
      disableRowSelectionOnClick
      localeText={{
        noRowsLabel: "没有数据",
        footerRowSelected: (count) =>
          count !== 0 ? `${count} 行被选中` : "没有行被选中",
      }}
    />
  );
};

export default CategoryTable;
