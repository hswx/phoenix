import React from 'react'
import { Category } from '../../..'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import DynamicCategory from './DynamicCategory';
import { CategoryType, TEXT_FIELD_ERROR_TYPE } from './../../../../../../../utils/constants';
import apis from './../../../../../../../apis';
import API_CODES from './../../../../../../../utils/API_CODES';
import { useAppSelector } from './../../../../../../../stores';
import { Food } from '../../../../FoodManage';
import StaticCategory from './StaticCategory';
import AsyncButton from './../../../../../../../components/AsyncButton';
import { RuleGroupTypeIC, formatQuery, parseSQL } from 'react-querybuilder';
import { updateCategoryRequestBody, createCategoryRequestBody } from './../../../../../../../apis/category';
import { useSnackbar } from 'notistack';

type EditCategoryProps = {
  id?: string;
  onSuccess: () => void;
}

const EditCateogry = (props: EditCategoryProps) => {
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

type CategoryFields = {
  name: string;
  ruleType: CategoryType;
}
type CategoryFieldsKeys = keyof Omit<CategoryFields, "ruleType">
interface EditCateogryDialogProps extends EditCategoryProps {
  open: boolean;
  onClose: () => void;
}

const EditCateogryDialog = (props: EditCateogryDialogProps) => {
  const [categoryFields, setCategoryFields] = React.useState<CategoryFields>({
    name: "",
    ruleType: CategoryType.SELECTED_CATEGORY,
  })

  const [categoryFieldsError, setCategoryFieldsError] = React.useState<Record<CategoryFieldsKeys, TEXT_FIELD_ERROR_TYPE>>({
    name: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const categoryFieldsErrorTips: {
    [categoryFieldsKey in (CategoryFieldsKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    name: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入菜品分类/名称"
    },
  }

  const getFieldErrorState = (key: CategoryFieldsKeys) => {
    return categoryFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && categoryFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldErrorTip = (key: CategoryFieldsKeys) => {
    const errorType = categoryFieldsError[key]
    return categoryFieldsErrorTips[key][errorType] || ""
  }

  const onCategoryFieldChange = (key: CategoryFieldsKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setCategoryFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: CategoryFieldsKeys) => (value: string) => {
    let fieldsState = TEXT_FIELD_ERROR_TYPE.UNKNOWN
    if (value) {
      fieldsState = TEXT_FIELD_ERROR_TYPE.NORMAL
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setCategoryFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onCategoryFieldBlur = (key: CategoryFieldsKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const onCategoryTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFields(prev => {
      return {
        ...prev,
        ruleType: Number(event.target.value) as CategoryType
      }
    })
  }

  const [foodList, setFoodList] = React.useState<Food[]>([])

  const storeId = useAppSelector(state => state.Root.storeId)

  const [selectedFoodList, setSelectedFoodList] = React.useState<Food[]>([]);
  const [unSelectFoodList, setUnSelectedFoodList] = React.useState<Food[]>([]);

  const getFoodList = async () => {
    const res = await apis.food.getFoodList({storeId});
    return res.code === API_CODES.SUCCESS && res.data || [];
  }

  const onSelectedFoodUpate = (value: Food[], isDelete?: boolean) => {
    if (isDelete) {
      setUnSelectedFoodList(prev => [...prev, ...value])
      setSelectedFoodList(prev => prev.filter(prevItem => !value.find(item => prevItem.id === item.id)))
    } else {
      setSelectedFoodList(prev => [...prev, ...value])
      setUnSelectedFoodList(prev => prev.filter(prevItem => !value.find(item => prevItem.id === item.id)))
    }
  }

  const [query, setQuery] = React.useState<RuleGroupTypeIC>({ rules: [] });

  const [originalSelectedList, setOriginalSelectedList] = React.useState<string[]>([]);

  const getCategory = async (id: string) => {
    const res = await apis.category.getCategory({categoryId: id}, {storeId})
    return res.code === API_CODES.SUCCESS && res.data || null
  }

  const initDetail = async (id?: string) => {
    const [foodList, categoryDetail] = await Promise.all([
      getFoodList(),
      id ? getCategory(props.id) : null
    ])
    setCategoryFields({
      name: "",
      ruleType: CategoryType.SELECTED_CATEGORY,
    })
    setCategoryFieldsError({
      name: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    })
    setQuery({ rules: [] })
    setUnSelectedFoodList([...foodList])
    setSelectedFoodList([])
    if (categoryDetail) {
      setCategoryFields({
        name: categoryDetail.name,
        ruleType: categoryDetail.ruleType,
      })
      setCategoryFieldsError({
        name: TEXT_FIELD_ERROR_TYPE.UNKNOWN
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
    const validateList = ["name"] as Array<CategoryFieldsKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(categoryFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

    let data: createCategoryRequestBody | updateCategoryRequestBody = {
      name: categoryFields.name,
      ruleType: categoryFields.ruleType,
    }
    if (categoryFields.ruleType === CategoryType.DYNAMIC_CATEGORY) {
      data.query = formatQuery(query, 'sql')
    } else {
      const addList = selectedFoodList.filter(item => !originalSelectedList.find(id => item.id === id)).map(item => item.id)
      const removeList = originalSelectedList.filter(id => !selectedFoodList.find(item => item.id === id))
      data.addFoodList = addList
      data.removeFoodList = removeList
    }
    if (props.id) {
      const res = await apis.category.updateCategory({categoryId: props.id}, {storeId}, data)
      if (res.code === API_CODES.SUCCESS) {
        enqueueSnackbar("菜品分类修改成功", {variant: "success"})
        props.onClose()
        props.onSuccess()
      } else {
        enqueueSnackbar("菜品分类修改失败", {variant: "error"})
      }
    } else {
      const res = await apis.category.createCategory({storeId}, data)
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
      <FormLabel>分类名称</FormLabel>
      <TextField
        placeholder="请输入分类名称"
        error={getFieldErrorState("name")}
        helperText={getFieldErrorTip("name")}
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
        <FormControlLabel value={CategoryType.SELECTED_CATEGORY} control={<Radio />} label="固定菜品" />
        <FormControlLabel value={CategoryType.DYNAMIC_CATEGORY} control={<Radio />} label="动态菜品" />
      </RadioGroup>
    </FormControl>
    <FormControl>
      <FormLabel>分类规则</FormLabel>
      <Box marginTop={1}>
        {categoryFields.ruleType === CategoryType.DYNAMIC_CATEGORY ?
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
