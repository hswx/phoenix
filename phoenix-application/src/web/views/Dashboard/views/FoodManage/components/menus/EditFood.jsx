import React from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Input, InputAdornment, MenuItem, Select, SelectChangeEvent, styled, TextField } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AsyncButton from "./../../../../../../components/AsyncButton";
import apis from "./../../../../../../apis";
import API_CODES from "./../../../../../../utils/API_CODES";
import { useSnackbar } from "notistack";
import { CUISINE, FLAVOR } from "../../../../../../utils/constants";
import RequiredTag from "../../../../../../components/RequiredTag";

const EditFood = (props) => {
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
        tip = "请输入菜品名称"
      }
      break;
    case "imgPath":
      if (value) {
        state = false
        tip = ""
      } else {
        state = true
        tip = "请上传菜品图片"
      }
      break;
    case "price":
      if (value) {
        state = false
        tip = ""
      } else {
        state = true
        tip = "请输入菜品价格"
      }
      break;
    default:
      break;
  }
  return {state, tip}
}

const EditFoodDialog = (props) => {
  const [foodFields, setFoodFields] = React.useState({
    name: "",
    imgPath: "",
    price: "",
    flavor: new Set(),
    cuisine: CUISINE.UNKNOWN,
  })

  const [foodFieldsValid, setFoodFieldsValid] = React.useState({
    name: {
      state: undefined,
      tip: "",
    },
    imgPath: {
      state: undefined,
      tip: "",
    },
    price: {
      state: undefined,
      tip: "",
    },
  })
  
  const onFoodFieldChange = (key) => (event) => {
    setFoodFields(prev => ({
      ...prev,
      [key]: event.target.value
    }))
    setFoodFieldsValid(prev => ({
      ...prev,
      [key]: {
        state: undefined,
        tip: "",
      }
    }))
  }

  const onFoodFieldBlur = (key) => (event) => {
    const value = event.target.value;
    const validateRes = validateField(key)(value)
    setFoodFieldsValid(prev => ({
      ...prev,
      [key]: validateRes
    }))
  }

  const [foodImage, setFoodImage] = React.useState(null);
  const onFoodUpload = (e) => {
    const file = e.target.files?.[0] || null;
        if (file) {
          setFoodImage(file);
          setFoodFields(prev => ({
            ...prev,
            imgPath: file.name
          }))
          setFoodFieldsValid(prev => ({
            ...prev,
            imgPath: {
              state: undefined,
              tip: ""
            },
          }))
        }
  }

  const onCuisineChange = (event) => {
    const value = event.target.value
    setFoodFields(prev => {
      return {
        ...prev,
        cuisine: Number(value)
      }
    })
  };

  const isFlavorChecked = (curFlavor) => {
    return foodFields.flavor.has(curFlavor);
  }
  const onFlavorChecked = (curFlavor) => (event) => {
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

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = async () => {
    const validateList = Object.keys(foodFieldsValid)
    let validatePass = true;
    validateList.forEach(key => {
      const validRes = validateField(key)(foodFields[key]);
      if (validRes.state !== false) {
        validatePass = false
      }
    })
    if (!validatePass) {
      return
    }

    if (props.data) {
      const res = await apis.food.updateFood({
        foodId: props.data.id,
      }, {
        name: foodFields.name,
        img: foodImage || undefined,
        imgPath: foodFields.imgPath,
        price: Number(foodFields.price),
        cuisine: foodFields.cuisine,
        flavor: Array.from(foodFields.flavor).map(Number),
      })
      if (res.code === API_CODES.SUCCESS && res.data) {
        enqueueSnackbar("菜品修改成功", {variant: "success"})
        props.onDataUpdate()
        props.onClose()
      } else {
        enqueueSnackbar("菜品修改失败", {variant: "error"})
      }
    } else {
      const res = await apis.food.createFood({
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
      setFoodFieldsValid({
        name: {
          state: undefined,
          tip: "",
        },
        imgPath: {
          state: undefined,
          tip: "",
        },
        price: {
          state: undefined,
          tip: "",
        },
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
          cuisine: CUISINE.UNKNOWN,
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
          <FormLabel>菜品名称<RequiredTag /></FormLabel>
          <TextField
            placeholder="请输入菜品名称"
            error={foodFieldsValid["name"].state}
            helperText={foodFieldsValid["name"].tip}
            fullWidth
            variant="standard"
            size="small"
            value={foodFields["name"]}
            onChange={onFoodFieldChange("name")}
            onBlur={onFoodFieldBlur("name")}
          />
        </FormControl>
        <FormControl variant="standard">
          <FormLabel focused={false}>菜品图片<RequiredTag /></FormLabel>
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
            error={foodFieldsValid["imgPath"].state}
            onBlur={onFoodFieldBlur("imgPath")}
          />
          {
            foodFieldsValid["imgPath"].state && <FormHelperText error={true}>{foodFieldsValid["imgPath"].tip}</FormHelperText>
          }
        </FormControl>
        <FormControl>
          <FormLabel>价格<RequiredTag /></FormLabel>
          <TextField
            placeholder="请输入菜品价格"
            value={foodFields.price}
            onChange={onFoodFieldChange("price")}
            type="number"
            variant="standard"
            error={foodFieldsValid["price"].state}
            helperText={foodFieldsValid["price"].tip}
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
            <MenuItem value={CUISINE.UNKNOWN}>默认</MenuItem>
            <MenuItem value={CUISINE.CHUAN_CAI + ""}>川菜</MenuItem>
            <MenuItem value={CUISINE.HUI_CAI + ""}>徽菜</MenuItem>
            <MenuItem value={CUISINE.LU_CAI + ""}>鲁菜</MenuItem>
            <MenuItem value={CUISINE.MIN_CAI + ""}>闽菜</MenuItem>
            <MenuItem value={CUISINE.SU_CAI + ""}>苏菜</MenuItem>
            <MenuItem value={CUISINE.XIANG_CAI + ""}>湘菜</MenuItem>
            <MenuItem value={CUISINE.YUE_CAI + ""}>粤菜</MenuItem>
            <MenuItem value={CUISINE.ZHE_CAI + ""}>浙菜</MenuItem>
          </Select>
        </FormControl>
          <FormControl focused={false}>
            <FormLabel>口味</FormLabel>
            <FormGroup sx={{display: 'flex', flexDirection: "row"}}>
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(FLAVOR.SWEET)} onChange={onFlavorChecked(FLAVOR.SWEET)} />
                }
                label="甜"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(FLAVOR.SOUR)} onChange={onFlavorChecked(FLAVOR.SOUR)} />
                }
                label="酸"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={isFlavorChecked(FLAVOR.SPICY)} onChange={onFlavorChecked(FLAVOR.SPICY)}/>
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
