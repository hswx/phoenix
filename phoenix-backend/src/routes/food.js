const express = require("express");
const multer = require( "multer");
const FormData = require( 'form-data');
const Food = require('./../model/Food');
const { FILE_SERVICE_HOST } = require('./../utils/config');
const { generateResponse } = require('./../utils');
const { Op } = require('sequelize');
const API_CODES = require("../utils/API_CODES");
const axios = require("axios");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create", upload.single('img'), async function(req, res) {
  try {
    const body = req.body
    if (!req.file) {
      throw new Error()
    }
    const form = new FormData()
    form.append('file', req.file.buffer, { filename: req.file.originalname });
    const fileUploadRes = await axios.post(`${FILE_SERVICE_HOST}/upload`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    const path = fileUploadRes.status === 200 && fileUploadRes.data.filename
    if (!path) {
      throw new Error()
    }
    const storeId = req.headers["bussiness-id"];
    const food = await new Food({
      storeId: storeId,
      name: body.name,
      price: body.price,
      imgPath: `${FILE_SERVICE_HOST}/uploads/` + path,
      cuisine: body.cuisine,
      flavor: body.flavor?.map(Number),
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
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.put("/update/:foodId", upload.single('img'), async function(req, res) {
  try {
    const foodId = req.params.foodId
    const body = req.body
    let imgPath = body.imgPath;
    if (req.file) {
      const form = new FormData()
      form.append('file', req.file.buffer, { filename: req.file.originalname });
      const fileUploadRes = await axios.post(`${FILE_SERVICE_HOST}/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      const path = fileUploadRes.status === 200 && fileUploadRes.data.filename
      if (path) {
        imgPath = `${FILE_SERVICE_HOST}/uploads/` + path
      } else {
        throw new Error()
      }
    }
    const storeId = req.headers["bussiness-id"];
    const food = await Food.findOne({
      where: {
        id: foodId,
        storeId: storeId,
      }
    })
    if (!food) {
      throw new Error()
    }
    food.set("name", body.name)
    food.set("imgPath", imgPath)
    food.set("price", body.price)
    food.set("cuisine", body.cuisine)
    food.set("flavor", body.flavor?.map(Number))

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
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.get("/list", async function(req, res) {
  const foodList = await Food.findAll({
    where: {
      storeId: req.body.storeId,
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

router.delete("/delete", async function (req, res) {
  try {
    const body = req.body
    const foodList = await Food.findAll({
      where: {
        storeId: body.storeId,
        deleted: false,
        id: {
          [Op.in]: body.foodList
        }
      },
    })
    foodList.forEach(item => {
      item.set("deleted", true)
      item.save();
    })
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.patch("/soldout", async function (req, res) {
  try {
    const body = req.body
    const foodList = await Food.findAll({
      where: {
        storeId: body.storeId,
        id: {
          [Op.in]: body.foodList
        }
      },
    })
    foodList.forEach(item => {
      item.set("soldOut", req.body.soldOut)
      item.save();
    })
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
