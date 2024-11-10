import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { Employee } from "..";
import { EmployeeSex } from "./../../../../../utils/constants";

const columns: GridColDef<Employee>[] = [
  { field: "name", headerName: "姓名", width: 160 },
  { field: "sex", headerName: "性别", width: 80, valueGetter: value => value === EmployeeSex.FEMALE ? "女": "男" },
  { field: "age", headerName: "年龄", type: "number", width: 80 },
  { field: "telephoneNumber", headerName: "手机号", width: 160 },
  { field: "qrCode", headerName: "设备二维码", width: 100 },
  {
    field: "employTime",
    headerName: "入职时间",
    width: 200,
    renderCell: (item) => {
      return dayjs(item.value).format('YYYY-MM-DD HH:mm:ss');
    }
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

type EmployeeTableProps = {
  data: Employee[];
  selectedIds: string[];
  onSelectedIdsChanged: (e: string[]) => void;
};

const EmployeeTable = (props: EmployeeTableProps) => {
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

export default EmployeeTable;
