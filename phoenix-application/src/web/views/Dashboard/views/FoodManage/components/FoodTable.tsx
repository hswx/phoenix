import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Food } from "..";
import { Chip } from "@mui/material";
import dayjs from "dayjs";

const columns: GridColDef<Food>[] = [
  { field: "name", headerName: "菜品名称", width: 240 },
  {
    field: "imgPath",
    headerName: "菜品图片",
    width: 120,
    renderCell: (item) => (
      <img src={`${item.value}`} loading="lazy" width="50px" height="50px" />
    ),
  },
  {
    field: "price",
    headerName: "价格",
    type: "number",
    width: 150,
  },
  {
    field: "soldOut",
    headerName: "状态",
    width: 100,
    renderCell: (item) => {
      return item.value ? (
        <Chip color="warning" size="small" label="已下架" />
      ) : (
        <Chip color="success" size="small" label="售卖中" />
      );
    },
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

type FoodTableProps = {
  data: Food[];
  selectedIds: string[];
  onSelectedIdsChanged: (e: string[]) => void;
};

const FoodTable = (props: FoodTableProps) => {
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

export default FoodTable;
