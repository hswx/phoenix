import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import DynamicCategory from './DynamicCategory';
import { CATEGORY_TYPE, TEXT_FIELD_ERROR_TYPE } from './../../../../../../../utils/constants';
import apis from './../../../../../../../apis';
import API_CODES from './../../../../../../../utils/API_CODES';
import StaticCategory from './StaticCategory';
import AsyncButton from './../../../../../../../components/AsyncButton';
import { formatQuery, parseSQL } from 'react-querybuilder';
import { useSnackbar } from 'notistack';
import RequiredTag from '../../../../../../../components/RequiredTag';

const EditCateogry = (props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button onClick={onDialogOpen} variant="contained">{props.id ? "修改分类" : "添加分类"}</Button>
    <EditCateogryDialog
      open={dialogVisible}
      onClose={onDialogClose}
      id={props.id}
      onSuccess={props.onSuccess}
    />
  </>
}

const validateField = (key) => (value) => {
  let state = undefined
  let tip = ""
  switch(key) {
    case "name":
      if (value) {
        state = false
        tip = ""
      } else {
        state = true
        tip = "请输入菜品分类名称"
      }
      break;
    default:
      break;
  }
  return {state, tip}
}

const EditCateogryDialog = (props) => {
  const [categoryFields, setCategoryFields] = React.useState({
    name: "",
    ruleType: CATEGORY_TYPE.SELECTED_CATEGORY,
  })

  const [categoryFieldsValid, setCategoryFieldsValid] = React.useState({
    name: {
      state: undefined,
      tip: "",
    },
  })

  const onCategoryFieldChange = (key) => (event) => {
    setCategoryFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setCategoryFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: "",
      }
    }))
  }

  const onCategoryFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value)
    setCategoryFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
  }

  const onCategoryTypeChange = (event) => {
    setCategoryFields(prev => {
      return {
        ...prev,
        ruleType: Number(event.target.value)
      }
    })
  }

  const [selectedFoodList, setSelectedFoodList] = React.useState([]);
  const [unSelectFoodList, setUnSelectedFoodList] = React.useState([]);

  const getFoodList = async () => {
    const res = await apis.food.getFoodList();
    return res.code === API_CODES.SUCCESS && res.data || [];
  }

  const onSelectedFoodUpate = (value, isDelete) => {
    if (isDelete) {
      setUnSelectedFoodList(prev => [...prev, ...value])
      setSelectedFoodList(prev => prev.filter(prevItem => !value.find(item => prevItem.id === item.id)))
    } else {
      setSelectedFoodList(prev => [...prev, ...value])
      setUnSelectedFoodList(prev => prev.filter(prevItem => !value.find(item => prevItem.id === item.id)))
    }
  }

  const [query, setQuery] = React.useState({ rules: [] });

  const [originalSelectedList, setOriginalSelectedList] = React.useState([]);

  const getCategory = async (id) => {
    const res = await apis.category.getCategory({categoryId: id})
    return res.code === API_CODES.SUCCESS && res.data || null
  }

  const initDetail = async (id) => {
    const [foodList, categoryDetail] = await Promise.all([
      getFoodList(),
      id ? getCategory(props.id) : null
    ])
    setCategoryFields({
      name: "",
      ruleType: CATEGORY_TYPE.SELECTED_CATEGORY,
    })
    setCategoryFieldsValid({
      name: {
        state: undefined,
        tip: "",
      }
    })
    setQuery({ rules: [] })
    setUnSelectedFoodList([...foodList])
    setSelectedFoodList([])
    if (categoryDetail) {
      setCategoryFields({
        name: categoryDetail.name,
        ruleType: categoryDetail.ruleType,
      })
      setCategoryFieldsValid({
        name: {
          state: undefined,
          tip: "",
        }
      })
      if (categoryDetail.query) {
        setQuery(parseSQL(categoryDetail.query, {
          independentCombinators: true
        }))
      } else {
        setQuery({ rules: [] })
      }
      if (categoryDetail.foodList) {
        setUnSelectedFoodList(foodList.filter(item => !categoryDetail.foodList.find(id => item.id === id)))
        setOriginalSelectedList([...categoryDetail.foodList])
        setSelectedFoodList(foodList.filter(item => categoryDetail.foodList.find(id => item.id === id)))
      }
    }
  }

  React.useEffect(() => {
    if (props.open) {
      initDetail(props.id)
    }
  }, [props.open, props.id]);

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async () => {
    const validateList = ["name"]
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(categoryFields[key]);
      if (validRes.state !== false) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

    let data = {
      name: categoryFields.name,
      ruleType: categoryFields.ruleType,
    }
    if (categoryFields.ruleType === CATEGORY_TYPE.DYNAMIC_CATEGORY) {
      data.query = formatQuery(query, 'sql')
    } else {
      const addList = selectedFoodList.filter(item => !originalSelectedList.find(id => item.id === id)).map(item => item.id)
      const removeList = originalSelectedList.filter(id => !selectedFoodList.find(item => item.id === id))
      data.addFoodList = addList
      data.removeFoodList = removeList
    }
    if (props.id) {
      const res = await apis.category.updateCategory({categoryId: props.id}, data)
      if (res.code === API_CODES.SUCCESS) {
        enqueueSnackbar("菜品分类修改成功", {variant: "success"})
        props.onClose()
        props.onSuccess()
      } else {
        enqueueSnackbar("菜品分类修改失败", {variant: "error"})
      }
    } else {
      const res = await apis.category.createCategory(data)
      if (res.code === API_CODES.SUCCESS) {
        enqueueSnackbar("菜品分类添加成功", {variant: "success"})
        props.onClose()
        props.onSuccess()
      } else {
        enqueueSnackbar("菜品分类添加失败", {variant: "error"})
      }
    }
  }

  return  <Dialog
    open={props.open}
    onClose={props.onClose}
    scroll="paper"
    maxWidth="sm"
    fullWidth={true}
  >
  <DialogTitle>{props.id ? "修改分类": "添加分类"}</DialogTitle>
  <DialogContent dividers={true}>
  <Box
    component="form"
    autoComplete="off"
    noValidate
    sx={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: 2,
    }}
  >
    <FormControl>
      <FormLabel>分类名称<RequiredTag /></FormLabel>
      <TextField
        placeholder="请输入分类名称"
        error={categoryFieldsValid["name"].state}
        helperText={categoryFieldsValid["name"].tip}
        fullWidth
        variant="standard"
        size="small"
        value={categoryFields["name"]}
        onChange={onCategoryFieldChange("name")}
        onBlur={onCategoryFieldBlur("name")}
      />
    </FormControl>
    <FormControl>
      <FormLabel focused={false}>分类类型</FormLabel>
      <RadioGroup
        row
        value={categoryFields["ruleType"]}
        onChange={onCategoryTypeChange}
      >
        <FormControlLabel value={CATEGORY_TYPE.SELECTED_CATEGORY} control={<Radio />} label="固定菜品" />
        <FormControlLabel value={CATEGORY_TYPE.DYNAMIC_CATEGORY} control={<Radio />} label="动态菜品" />
      </RadioGroup>
    </FormControl>
    <FormControl>
      <FormLabel>分类规则</FormLabel>
      <Box marginTop={1}>
        {categoryFields.ruleType === CATEGORY_TYPE.DYNAMIC_CATEGORY ?
        <DynamicCategory query={query} setQuery={setQuery}/>:
        <StaticCategory
          key={props.open + "" + categoryFields.ruleType}
          leftList={unSelectFoodList}
          rightList={selectedFoodList}
          onTransfer={onSelectedFoodUpate}
        />}
      </Box>
    </FormControl>
  </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={props.onClose}>取消</Button>
    <AsyncButton onClick={onSubmit}>保存</AsyncButton>
  </DialogActions>
</Dialog>
}


export default EditCateogry;
