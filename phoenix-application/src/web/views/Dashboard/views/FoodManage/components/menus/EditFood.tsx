import React from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Input, InputAdornment, MenuItem, Select, SelectChangeEvent, styled, TextField } from "@mui/material";
import { Cuisine, Flavor, TEXT_FIELD_ERROR_TYPE } from "./../../../../../../utils/constants";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AsyncButton from "./../../../../../../components/AsyncButton";
import { useAppSelector } from "./../../../../../../stores";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { Food } from "../..";

type EditFoodProps = {
  data?: Food
  onDataUpdate: (e?: Partial<Food>) => void
}
const EditFood = (props: EditFoodProps) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const onDialogOpen = () => setDialogVisible(true);
  const onDialogClose = () => setDialogVisible(false);

  return <>
    <Button onClick={onDialogOpen} variant="contained">{props.data?.id ? "修改菜品" : "添加菜品"}</Button>
    <EditFoodDialog
      data={props.data}
      onDataUpdate={props.onDataUpdate}
      open={dialogVisible}
      onClose={onDialogClose}
    />
  </>
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix=""
      />
    );
  },
);

type FoodFields = {
  name: string;
  imgPath: string;
  price: string;
  flavor: Set<Flavor>;
  cuisine: Cuisine;
}
type FoodFieldsKeys = keyof Omit<FoodFields, 'flavor' | 'cuisine'>
interface EditFoodDialogProps extends EditFoodProps {
  open: boolean;
  onClose: () => void;
}
const EditFoodDialog = (props: EditFoodDialogProps) => {
  const [foodFields, setFoodFields] = React.useState<FoodFields>({
    name: "",
    imgPath: "",
    price: "",
    flavor: new Set(),
    cuisine: Cuisine.UNKNOWN,
  })

  const [foodFieldsError, setFoodFieldsError] = React.useState<Record<FoodFieldsKeys, TEXT_FIELD_ERROR_TYPE>>({
    name: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    imgPath: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
    price: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
  })

  const foodFieldsErrorTips: {
    [foodFieldsKey in (FoodFieldsKeys)]: {
      [errorTypeKey in TEXT_FIELD_ERROR_TYPE]?: string
    }
  } = {
    name: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入菜品名称"
    },
    imgPath: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请上传菜品图片",
    },
    price: {
      [TEXT_FIELD_ERROR_TYPE.REQUIRED]: "请输入菜品价格",
    }
  }

  const getFieldErrorState = (key: FoodFieldsKeys) => {
    return foodFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.NORMAL && foodFieldsError[key] !== TEXT_FIELD_ERROR_TYPE.UNKNOWN
  }

  const getFieldErrorTip = (key: FoodFieldsKeys) => {
    const errorType = foodFieldsError[key]
    return foodFieldsErrorTips[key][errorType] || ""
  }

  const onFoodFieldChange = (key: FoodFieldsKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFoodFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setFoodFieldsError(prev => ({
      ...prev,
      [key]: TEXT_FIELD_ERROR_TYPE.UNKNOWN
    }))
  }

  const validateField = (key: FoodFieldsKeys) => (value: string) => {
    let fieldsState = TEXT_FIELD_ERROR_TYPE.UNKNOWN
    if (value) {
      fieldsState = TEXT_FIELD_ERROR_TYPE.NORMAL
    } else {
      fieldsState = TEXT_FIELD_ERROR_TYPE.REQUIRED
    }
    setFoodFieldsError(prev => ({
      ...prev,
      [key]: fieldsState
    }))
    return fieldsState
  }

  const onFoodFieldBlur = (key: FoodFieldsKeys) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    validateField(key)(value);
  }

  const [foodImage, setFoodImage] = React.useState<File | null>(null);
  const onFoodUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
        if (file) {
          setFoodImage(file);
          setFoodFields(prev => ({
            ...prev,
            imgPath: file.name
          }))
          setFoodFieldsError(prev => ({
            ...prev,
            imgPath: TEXT_FIELD_ERROR_TYPE.NORMAL,
          }))
        }
  }

  const onCuisineChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setFoodFields(prev => {
      return {
        ...prev,
        cuisine: Number(value) as Cuisine
      }
    })
  };

  const isFlavorChecked = (curFlavor: Flavor) => {
    return foodFields.flavor.has(curFlavor);
  }
  const onFlavorChecked = (curFlavor: Flavor) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFoodFields(prev => {
      const list = new Set(prev.flavor.values());
      if (checked) {
        list.add(curFlavor)
      } else {
        list.delete(curFlavor)
      }
      return {
        ...prev,
        flavor: list
      }
    })
  }

  const storeId = useAppSelector(state => state.Root.storeId)

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async () => {
    if (!storeId) {
      return
    }
    const validateList = Object.keys(foodFields) as Array<FoodFieldsKeys>
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(foodFields[key]);
      if (validRes !== TEXT_FIELD_ERROR_TYPE.NORMAL) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

    if (props.data) {
      const res = await apis.food.updateFood({
        storeId,
        foodId: props.data.id,
      }, {
        name: foodFields.name,
        img: foodImage || undefined,
        imgPath: foodFields.imgPath,
        price: Number(foodFields.price),
        cuisine: foodFields.cuisine,
        flavor: Array.from(foodFields.flavor),
      })
      if (res.code === API_CODES.SUCCESS && res.data) {
        enqueueSnackbar("菜品修改成功", {variant: "success"})
        props.onDataUpdate({
          id: res.data.id,
          name: res.data.name,
          imgPath: res.data.imgPath,
          price: res.data.price,
          cuisine: res.data.cuisine,
          flavor: res.data.flavor,
        })
        props.onClose()
      } else {
        enqueueSnackbar("菜品修改失败", {variant: "error"})
      }
    } else {
      const res = await apis.food.createFood({storeId}, {
        name: foodFields.name,
        img: foodImage,
        price: Number(foodFields.price),
        cuisine: foodFields.cuisine,
        flavor: Array.from(foodFields.flavor),
      })
      if (res.code === API_CODES.SUCCESS && res.data) {
        enqueueSnackbar("菜品添加成功", {variant: "success"})
        props.onDataUpdate()
        props.onClose()
      } else {
        enqueueSnackbar("菜品添加失败", {variant: "error"})
      }
    }
  }

  React.useEffect(() => {
    if (props.open) {
      setFoodImage(null)
      setFoodFieldsError({
        name: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
        imgPath: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
        price: TEXT_FIELD_ERROR_TYPE.UNKNOWN,
      })
      if (props.data?.id) {
        setFoodFields({
          name: props.data.name,
          imgPath: props.data.imgPath,
          price: props.data.price + "",
          flavor: new Set(props.data.flavor.map(item => Number(item))),
          cuisine: props.data.cuisine,
        })
      } else {
        setFoodFields({
          name: "",
          imgPath: "",
          price: "",
          flavor: new Set(),
          cuisine: Cuisine.UNKNOWN,
        })
      }
    }
  }, [props.open, props.data?.id]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>{props.data?.id ? "修改菜品": "添加菜品"}</DialogTitle>
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
          <FormLabel>菜品名称</FormLabel>
          <TextField
            placeholder="请输入菜品名称"
            error={getFieldErrorState("name")}
            helperText={getFieldErrorTip("name")}
            fullWidth
            variant="standard"
            size="small"
            value={foodFields["name"]}
            onChange={onFoodFieldChange("name")}
            onBlur={onFoodFieldBlur("name")}
          />
        </FormControl>
        <FormControl variant="standard">
          <FormLabel focused={false}>菜品图片</FormLabel>
          <Input
            sx={{marginTop: "0 !important"}}
            readOnly
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                 component="label"
                  edge="end"
                  tabIndex={-1}
                  sx={{marginRight: 1}}
                >
                  <FileUploadIcon />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={onFoodUpload}
                    accept="image/*"
                  />
                </IconButton>
              </InputAdornment>
            }
            placeholder="请上传菜品图片"
            value={foodFields["imgPath"]}
            onChange={onFoodFieldChange("imgPath")}
            error={getFieldErrorState("imgPath")}
            onBlur={onFoodFieldBlur("imgPath")}
          />
          {
            getFieldErrorState("imgPath") && <FormHelperText error={true}>{getFieldErrorTip("imgPath")}</FormHelperText>
          }
        </FormControl>
        <FormControl>
          <FormLabel>价格</FormLabel>
          <TextField
            placeholder="请输入菜品价格"
            value={foodFields.price}
            onChange={onFoodFieldChange("price")}
            slotProps={{
              input: {
                inputComponent: NumericFormatCustom as any,
              },
            }}
            variant="standard"
            error={getFieldErrorState("price")}
            helperText={getFieldErrorTip("price")}
            onBlur={onFoodFieldBlur("price")}
          />
        </FormControl>
        <FormControl focused={false}>
          <FormLabel>菜系</FormLabel>
          <Select
            variant="standard"
            sx={{marginTop: "0 !important"}}
            value={foodFields.cuisine + ""}
            onChange={onCuisineChange}
          >
            <MenuItem value={Cuisine.UNKNOWN}>默认</MenuItem>
            <MenuItem value={Cuisine.CHUAN_CAI + ""}>川菜</MenuItem>
            <MenuItem value={Cuisine.HUI_CAI + ""}>徽菜</MenuItem>
            <MenuItem value={Cuisine.LU_CAI + ""}>鲁菜</MenuItem>
            <MenuItem value={Cuisine.MIN_CAI + ""}>闽菜</MenuItem>
            <MenuItem value={Cuisine.SU_CAI + ""}>苏菜</MenuItem>
            <MenuItem value={Cuisine.XIANG_CAI + ""}>湘菜</MenuItem>
            <MenuItem value={Cuisine.YUE_CAI + ""}>粤菜</MenuItem>
            <MenuItem value={Cuisine.ZHE_CAI + ""}>浙菜</MenuItem>
          </Select>
        </FormControl>
          <FormControl focused={false}>
            <FormLabel>口味</FormLabel>
            <FormGroup sx={{display: 'flex', flexDirection: "row"}}>
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(Flavor.SWEET)} onChange={onFlavorChecked(Flavor.SWEET)} />
                }
                label="甜"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(Flavor.SOUR)} onChange={onFlavorChecked(Flavor.SOUR)} />
                }
                label="酸"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(Flavor.SPICY)} onChange={onFlavorChecked(Flavor.SPICY)}/>
                }
                label="辣"
              />
            </FormGroup>
          </FormControl>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>取消</Button>
        <AsyncButton onClick={onSubmit}>保存</AsyncButton>
      </DialogActions>
    </Dialog>
);

}

export default EditFood;
