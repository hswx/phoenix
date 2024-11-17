import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import Image from "../../../../../components/Image";
import { CUISINE, FLAVOR } from "../../../../../utils/constants";

const columns = [
  { field: "name", headerName: "菜品名称", width: 240 },
  {
    field: "imgPath",
    headerName: "菜品图片",
    width: 100,
    renderCell: (item) => (
      <Image src={`${item.value}`} loading="lazy" width="50px" height="50px"/>
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
        [CUISINE.UNKNOWN]: "",
        [CUISINE.CHUAN_CAI]: "川菜",
        [CUISINE.HUI_CAI]: "徽菜",
        [CUISINE.LU_CAI]: "鲁菜",
        [CUISINE.MIN_CAI]: "闽菜",
        [CUISINE.SU_CAI]: "苏菜",
        [CUISINE.XIANG_CAI]: "湘菜",
        [CUISINE.YUE_CAI]: "粤菜",
        [CUISINE.ZHE_CAI]: "浙菜",
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
        [FLAVOR.SOUR]: "酸",
        [FLAVOR.SWEET]: "甜",
        [FLAVOR.SPICY]: "辣",
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

const FoodTable = (props) => {
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
