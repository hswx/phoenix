import React from "react";
import { Button, Checkbox, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { Food } from "../../../../FoodManage";

type StaticCategoryProps = {
  leftList: Food[];
  rightList: Food[];
  onTransfer: (value: Food[], isDelete?: boolean) => void;
}

const StaticCategory = (props: StaticCategoryProps) => {
  const [checkedList, setCheckedList] = React.useState<Food[]>([]);

  const leftCheckedList = React.useMemo(() =>
    checkedList.filter(checkedItem =>
      !!props.leftList.find(item => item.id === checkedItem.id))
  , [props.leftList, checkedList])

  const rightCheckedList = React.useMemo(() =>
    checkedList.filter(checkedItem =>
      !!props.rightList.find(item => item.id === checkedItem.id))
  , [props.rightList, checkedList])

  const handleToggle = (value: Food) => () => {
    const currentIndex = checkedList.findIndex(item => item.id === value.id);
    const newChecked = [...checkedList];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedList(newChecked);
  };

  const handleAllRight = () => {
    props.onTransfer(props.leftList)
  };

  const handleCheckedRight = () => {
    props.onTransfer(leftCheckedList)
    setCheckedList(prev => prev.filter(checkedItem => !prev.find(item => checkedItem.id === item.id)))
  };

  const handleCheckedLeft = () => {
    props.onTransfer(rightCheckedList, true)
    setCheckedList(prev => prev.filter(checkedItem => !prev.find(item => checkedItem.id === item.id)))
  };

  const handleAllLeft = () => {
    props.onTransfer(props.rightList, true)
  };

  const customList = (items: Food[]) => (
    <Paper sx={{ width: 224, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: Food) => {
          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={!!checkedList.find(item => item.id === value.id)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={value.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid2
      container
      spacing={2}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid2>{customList(props.leftList)}</Grid2>
      <Grid2>
        <Grid2 container direction="column" sx={{ alignItems: 'center' }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={props.leftList.length === 0}
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftCheckedList.length === 0}
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightCheckedList.length === 0}
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={props.rightList.length === 0}
          >
            ≪
          </Button>
        </Grid2>
      </Grid2>
      <Grid2>{customList(props.rightList)}</Grid2>
    </Grid2>
  );
}

export default StaticCategory
