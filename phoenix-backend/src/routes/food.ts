import express, { Request, Response } from 'express';
import API_CODES from '../utils/API_CODES';
import axios, { AxiosResponse } from "axios";
import multer from "multer";
import FormData from 'form-data';
import Food from './../model/Food';
import { FILE_SERVICE_HOST } from './../utils/config';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

type createFoodRequestBody = {
  name: string;
  img: File;
  price: number;
}
type createFoodResponseBody = {

}
router.post("/create/:storeId", upload.single('img'), async function(req: Request<{storeId: string}, undefined, createFoodRequestBody>, res: any) {
  const storeId = req.params.storeId
  const body = req.body
    if (req.file) {
      const form = new FormData()
      form.append('file', req.file.buffer, { filename: req.file.originalname });

      const fileUploadRes: AxiosResponse<{
        filename: string
      }> = await axios.post(`${FILE_SERVICE_HOST}/upload`, form, {
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
        imgPath: `${FILE_SERVICE_HOST}/uploads/` + path
      }).save();

      const dataValue = food.dataValues;

      res.sendResponse(API_CODES.SUCCESS, {
        name: dataValue.name,
        price: dataValue.price,
        imgPath: dataValue.imgPath,
      })
    } else {
      throw Error()
    }
})

type updateFoodRequestBody = {
  name: string;
  img?: File;
  price: number;
}
router.put("/update/:storeId/:foodId", upload.single('img'), async function(req: Request<{storeId: string, foodId: string}>, res: Response<createFoodRequestBody>) {
  const storeId = req.params.storeId
  const foodId = req.params.foodId
  const body = req.body
  let imgPath = body.imgPath;
    if (req.file) {
      const form = new FormData()
      form.append('file', req.file.buffer, { filename: req.file.originalname });

      const fileUploadRes: AxiosResponse<{
        filename: string
      }> = await axios.post(`${FILE_SERVICE_HOST}/upload`, form, {
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
        food.set("imgPath", imgPath)
        food.set("price", body.price)
        const saveRes = await food.save();
        const dataValue = saveRes.dataValues;
        res.sendResponse(API_CODES.SUCCESS, {
          id: dataValue.id,
          name: dataValue.name,
          price: dataValue.price,
          imgPath: dataValue.imgPath,
        })
      } else {
        throw new Error()
      }
})


type getFoodListResponseBody = {
  id: string;
  name: string;
  imgPath: string;
  price: number;
  soldOut: boolean;
  createdAt: Date;
}[]
router.get("/list/:storeId", async function(req, res: Response<getFoodListResponseBody>) {
  const storeId = req.params.storeId
  const foodList = await Food.findAll({
    where: {
      storeId,
    },
    order: [['createdAt', 'ASC']]
  })
  res.sendResponse(API_CODES.SUCCESS, foodList.map(item => {
    const data = item.dataValues;
    return {
      id: data.id,
      name: data.name,
      imgPath: data.imgPath,
      price: data.price,
      soldOut: data.soldOut,
      createdAt: data.createdAt,
    }
}))
})

export default router;
