import React from "react";
import { Box, Stack } from "@mui/material";
import apis from "./../../../../apis";
import { useAppSelector } from "./../../../../stores";
import API_CODES from "./../../../../utils/API_CODES";
import { EmployeeSex } from "./../../../../utils/constants";
import EmployeeTable from "./components/EmployeeTable";
import EditEmployee from "./components/menus/EditEmployee";
import DeleteEmployee from "./components/menus/DeleteEmployee";

export type Employee = {
  id: string;
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: Date;
  createdAt: Date;
}

const EmployeeManage = () => {
  const [employeeList, setEmployeeList] = React.useState<Employee[]>([])

  const storeId = useAppSelector(state => state.Root.storeId)

  const getEmployeeList = async () => {
    const res = await apis.employee.getEmployeeList({storeId});
    if (res.code === API_CODES.SUCCESS && res.data){
      setEmployeeList(res.data)
    }
  }

  React.useEffect(() => {
    getEmployeeList()
  }, [])

  const [selectedEmployeeIds, setSelectedEmployeeIds] = React.useState<string[]>([])
  const onSetSelectedEmployeeIdsChanged = (e: string[]) => {
    setSelectedEmployeeIds(e)
  }

  return <Box sx={{
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }}>
    <Stack direction="row" spacing={2}>
      {selectedEmployeeIds.length === 0 && <EditEmployee onSuccess={getEmployeeList}/>}
      {selectedEmployeeIds.length === 1 && <EditEmployee id={selectedEmployeeIds[0]} onSuccess={getEmployeeList}/>}
      {selectedEmployeeIds.length > 0 && <DeleteEmployee employeeIds={selectedEmployeeIds} onDeleted={getEmployeeList} />}
    </Stack>
    <Box sx={{marginTop: 2, flexGrow: 1, width: "100%"}}>
      <EmployeeTable data={employeeList} selectedIds={selectedEmployeeIds} onSelectedIdsChanged={onSetSelectedEmployeeIdsChanged}/>
    </Box>
  </Box>
}

export default EmployeeManage
