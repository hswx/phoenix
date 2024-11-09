import express from 'express';
import API_CODES from '../utils/API_CODES';
import axios, { AxiosResponse } from "axios";
import multer from "multer";
import FormData from 'form-data';
import Food, { Cuisine, Flavor } from './../model/Food';
import { FILE_SERVICE_HOST } from './../utils/config';
import { commonResponse, generateResponse } from './../utils';
import { Op } from 'sequelize';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

type uploadResponse = {
  filename: string;
}

type createFoodRequestParam = {
  storeId: string;
}
type createFoodRequestBody = {
  name: string;
  img: File;
  price: number;
  flavor: Flavor[];
  cuisine: Cuisine;
}
type createFoodResponse = {
  name: string;
  imgPath: string;
  price: number;
  flavor: Flavor[];
  cuisine: Cuisine;
}
router.post<string, createFoodRequestParam, commonResponse<createFoodResponse>, createFoodRequestBody>("/create/:storeId", upload.single('img'), async function(req, res) {
  const storeId = req.params.storeId
  const body = req.body
    if (req.file) {
      const form = new FormData()
      form.append('file', req.file.buffer, { filename: req.file.originalname });

      const fileUploadRes = await axios.post<uploadResponse>(`${FILE_SERVICE_HOST}/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      const path = fileUploadRes.status === 200 && fileUploadRes.data.filename
      if (!path) {
        throw new Error()
      }
      const food = await new Food({
        storeId,
        name: body.name,
        price: body.price,
        imgPath: `${FILE_SERVICE_HOST}/uploads/` + path,
        cuisine: body.cuisine,
        flavor: body.flavor,
      }).save();

      const dataValue = food.dataValues;

      res.status(200).send(generateResponse(
        API_CODES.SUCCESS,
        {
          name: dataValue.name,
          price: dataValue.price,
          imgPath: dataValue.imgPath,
          flavor: dataValue.flavor,
          cuisine: dataValue.cuisine,
        }
      ))
    } else {
      throw Error()
    }
})

type updateFoodRequestParam = {
  storeId: string;
  foodId: string;
}
type updateFoodRequestBody = {
  name: string;
  img?: File;
  imgPath?: string;
  price: number;
  flavor: Flavor[];
  cuisine: Cuisine;
}
type updateFoodResponse = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  flavor: Flavor[];
  cuisine: Cuisine;
}
router.put<string, updateFoodRequestParam, commonResponse<updateFoodResponse>, updateFoodRequestBody>("/update/:storeId/:foodId", upload.single('img'), async function(req, res) {
  const storeId = req.params.storeId
  const foodId = req.params.foodId
  const body = req.body
  let imgPath = body.imgPath;
    if (req.file) {
      const form = new FormData()
      form.append('file', req.file.buffer, { filename: req.file.originalname });

      const fileUploadRes: AxiosResponse<uploadResponse> = await axios.post(`${FILE_SERVICE_HOST}/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      const path = fileUploadRes.status === 200 && fileUploadRes.data.filename
      if (path) {
        imgPath = `${FILE_SERVICE_HOST}/uploads/` + path
      }
    }
      const food = await Food.findOne({
        where: {
          storeId,
          id: foodId
        }
      })

      if (food) {
        food.set("name", body.name)
        food.set("imgPath", imgPath as string)
        food.set("price", body.price)
        food.set("cuisine", body.cuisine)
        food.set("flavor", body.flavor)
        const saveRes = await food.save();
        const dataValue = saveRes.dataValues;
        res.status(200).send(generateResponse(
          API_CODES.SUCCESS,
          {
            id: dataValue.id,
            name: dataValue.name,
            price: dataValue.price,
            imgPath: dataValue.imgPath,
            flavor: dataValue.flavor,
            cuisine: dataValue.cuisine,
          }
        ))
      } else {
        throw new Error()
      }
})

type getFoodListRequestParam = {
  storeId: string;
}
type getFoodListResponseBody = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  flavor: Flavor[];
  cuisine: Cuisine;
  soldOut: boolean;
  createdAt: number;
}[]
router.get<string, getFoodListRequestParam, commonResponse<getFoodListResponseBody>>("/list/:storeId", async function(req, res) {
  const storeId = req.params.storeId
  const foodList = await Food.findAll({
    where: {
      storeId,
      deleted: false,
    },
    order: [['createdAt', 'DESC']]
  })
  res.status(200).send(generateResponse(
    API_CODES.SUCCESS,
    foodList.map(item => {
      const data = item.dataValues;
      return {
        id: data.id,
        name: data.name,
        imgPath: data.imgPath,
        price: data.price,
        flavor: data.flavor,
        cuisine: data.cuisine,
        soldOut: data.soldOut,
        createdAt: data.createdAt?.valueOf() || 0,
      }
    })
  ))
})

type deleteFoodRequestParam = {
  storeId: string;
}
type deleteFoodRequestBody = {
  foodList: string[];
}
router.delete<string, deleteFoodRequestParam, commonResponse, deleteFoodRequestBody>("/delete/:storeId", async function (req, res) {
  const storeId = req.params.storeId
  const bodyFoodList = req.body.foodList
  const foodList = await Food.findAll({
    where: {
      storeId,
      deleted: false,
      id: {
        [Op.in]: bodyFoodList
      }
    },
  })
  foodList.forEach(item => {
    item.set("deleted", true)
    item.save();
  })
  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

type soldOutFoodRequestParam = {
  storeId: string;
}
type soldOutFoodRequestBody = {
  foodList: string[];
  soldOut: boolean;
}
router.patch<string, soldOutFoodRequestParam, commonResponse, soldOutFoodRequestBody>("/soldout/:storeId", async function (req, res) {
  const storeId = req.params.storeId
  const bodyFoodList = req.body.foodList
  const foodList = await Food.findAll({
    where: {
      storeId,
      id: {
        [Op.in]: bodyFoodList
      }
    },
  })
  foodList.forEach(item => {
    item.set("soldOut", req.body.soldOut)
    item.save();
  })
  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

export default router;
