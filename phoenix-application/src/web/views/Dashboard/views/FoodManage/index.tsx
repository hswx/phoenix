import React from "react";
import { Box, Button, Divider, Stack } from "@mui/material";
import EditFood from "./components/menus/EditFood";

const FoodManage = () => {
  return <Box>
    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <EditFood />
    </Stack>
  </Box>
}

export default FoodManage
