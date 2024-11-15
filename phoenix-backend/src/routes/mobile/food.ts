import express from 'express';
import Food from './../../model/Food';
import { generateResponse } from './../../utils';
import API_CODES from './../../utils/API_CODES';
import Category, { CategoryType } from './../../model/Category';
import FoodCategory from './../../model/FoodCategory';
import sequelize from './../../dao/db';

const router = express.Router();

router.get("/list", async (req, res) => {
  const storeId = req.query.storeId as string
  const foodList = await Food.findAll({
    where: {
      storeId,
      deleted: false,
      soldOut: false,
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
      }
    })
  ))
})

router.get("/fullist", async (req, res) => {
  const storeId = req.query.storeId as string
  const categoryListRes = await Category.findAll({
    where: {
      storeId,
      deleted: false,
    },
    order: [['createdAt', 'DESC']]
  })
  const categoryList = await Promise.all(categoryListRes.map(async item => {
    const category = item.dataValues
    if (category.ruleType === CategoryType.DYNAMIC_CATEGORY) {
      const resList = await sequelize.query(`SELECT * FROM foods WHERE ${category.query}`, {
        model: Food,
        mapToModel: true,
      })
      return {
        id: category.id,
        name: category.name,
        foodList: resList.map(item => ({
          id: item.dataValues.id,
          name: item.dataValues.name,
          imgPath: item.dataValues.imgPath,
          cuisine: item.dataValues.cuisine,
          flavor: item.dataValues.flavor,
          price: item.dataValues.price,
        })),
      }
    } else {
      const foodCategoryListRes = await FoodCategory.findAll({
        where: {
          storeId,
          categoryId: category.id,
        }
      })

      const foodList = await Promise.all(foodCategoryListRes.map(async item => {
        const foodCategoryRes = item.dataValues
        const foodRes = await Food.findOne({
          where: {
            storeId,
            id: foodCategoryRes.foodId,
            deleted: false
          }
        })
        
        const food = foodRes?.dataValues
        return {
          id: food?.id,
          name: food?.name,
          imgPath: food?.imgPath,
          cuisine: food?.cuisine,
          flavor: food?.flavor,
          price: food?.price,
        }
      }))
  
      return {
        id: category.id,
        name: category.name,
        foodList: foodList,
      }
    }
  }))

  res.status(200).send(generateResponse(API_CODES.SUCCESS, categoryList))
})

export default router;
