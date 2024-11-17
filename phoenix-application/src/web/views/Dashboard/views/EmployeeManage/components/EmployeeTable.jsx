import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { SEX } from "./../../../../../utils/constants";
import Image from "./../../../../../components/Image";

const columns = [
  { field: "name", headerName: "姓名", width: 160 },
  { field: "sex", headerName: "性别", width: 80, valueGetter: value => value === SEX.FEMALE ? "女": (value === SEX.MALE ? "男" :"")},
  { field: "age", headerName: "年龄", type: "number", width: 80 },
  { field: "telephone", headerName: "手机号", width: 160 },
  { field: "qrCode", headerName: "设备二维码", width: 100, renderCell: (item) => {
    return <Image src={item.value} width="50px" height="50px" qrcode={true}/>
  }},
  {
    field: "createdAt",
    headerName: "创建时间",
    width: 200,
    renderCell: (item) => {
      return dayjs(item.value).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];

const EmployeeTable = (props) => {
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
