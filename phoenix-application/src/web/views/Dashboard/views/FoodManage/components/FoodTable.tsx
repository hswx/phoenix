import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Food } from "..";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import { Cuisine, Flavor } from "./../../../../../utils/constants";
import Image from "./../../../../../components/Image";

const columns: GridColDef<Food>[] = [
  { field: "name", headerName: "菜品名称", width: 240 },
  {
    field: "imgPath",
    headerName: "菜品图片",
    width: 100,
    renderCell: (item) => (
      <Image src={`${item.value}`} width="50px" height="50px"/>
      // <img src={`${item.value}`} loading="lazy" width="50px" height="50px" />
    ),
  },
  {
    field: "price",
    headerName: "价格",
    type: "number",
    width: 100,
  },
  {
    field: "cuisine",
    headerName: "菜系",
    width: 100,
    valueGetter: (value, row) => {
      const cuisineMap = {
        [Cuisine.UNKNOWN]: "",
        [Cuisine.CHUAN_CAI]: "川菜",
        [Cuisine.HUI_CAI]: "徽菜",
        [Cuisine.LU_CAI]: "鲁菜",
        [Cuisine.MIN_CAI]: "闽菜",
        [Cuisine.SU_CAI]: "苏菜",
        [Cuisine.XIANG_CAI]: "湘菜",
        [Cuisine.YUE_CAI]: "粤菜",
        [Cuisine.ZHE_CAI]: "浙菜",
      }
      return row.cuisine && cuisineMap[row.cuisine] || ""
    }
  },
  {
    field: "flavor",
    headerName: "口味",
    width: 100,
    valueGetter: (value, row) => {
      const flavorMap = {
        [Flavor.SOUR]: "酸",
        [Flavor.SWEET]: "甜",
        [Flavor.SPICY]: "辣",
      }
      return row.flavor.map(item => flavorMap[item]).join(", ")
    }
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
