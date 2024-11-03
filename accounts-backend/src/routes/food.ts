import express, { Request } from 'express';
import API_CODES from '../utils/API_CODES';
import axios, { AxiosResponse } from "axios";
import multer from "multer";
import FormData from 'form-data';
import Food from './../model/Food';
import { FILE_SERVICE_HOST } from './../utils/config';

const storage = multer.memoryStorage(); // 使用内存存储
const upload = multer({ storage });

const router = express.Router();

type createFoodRequestBody = {
  name: string;
  img: File;
  price: number;
}
router.post("/create/:storeId", upload.single('img'), async function(req: Request<{storeId: string}, undefined, createFoodRequestBody>, res) {
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

export default router;
