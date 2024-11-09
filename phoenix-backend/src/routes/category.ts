import express from 'express';
import API_CODES from '../utils/API_CODES';
import axios, { AxiosResponse } from "axios";
import FormData from 'form-data';
import Food, { Cuisine, Flavor } from '../model/Food';
import { FILE_SERVICE_HOST } from '../utils/config';
import { commonResponse, generateResponse } from '../utils';
import { Op, Sequelize } from 'sequelize';
import Category, { CategoryType } from './../model/Category';
import FoodCategory from './../model/FoodCategory';
import sequelize from './../dao/db';

const router = express.Router();

type getCategoryListRequestQuery = {
  storeId: string;
}
type getCategoryListResponseBody = {
  id: string;
  name: string;
  ruleType: CategoryType;
  foodCount: number;
  createdAt: number;
}[]
router.get<string, undefined, commonResponse<getCategoryListResponseBody>, undefined, getCategoryListRequestQuery>("/list", async function(req, res) {
  const storeId = req.query.storeId
  const categoryList = await Category.findAll({
    where: {
      storeId,
      deleted: false,
    },
    order: [['createdAt', 'DESC']]
  })
  const list = await Promise.all(categoryList.map(async item => {
    const dataValue = item.dataValues;
    if (item.dataValues.ruleType === CategoryType.SELECTED_CATEGORY) {
      const resList = await FoodCategory.findAndCountAll({
        where: {
          storeId,
          categoryId: dataValue.id
        }
      })
      return {
        id: dataValue.id,
        name: dataValue.name,
        ruleType: dataValue.ruleType,
        foodCount: resList.count,
        createdAt: dataValue.createdAt?.valueOf() || 0,
      }
    } else {
      const resList = await sequelize.query(`SELECT * FROM foods WHERE ${item.dataValues.query}`, {
        model: Food,
        mapToModel: true,
      })
      return {
        id: dataValue.id,
        name: dataValue.name,
        ruleType: dataValue.ruleType,
        foodCount: resList.length,
        createdAt: dataValue.createdAt?.valueOf() || 0,
      }
    }
  }))
  res.status(200).send(generateResponse(
    API_CODES.SUCCESS,
    list
  ))
})

type createCategoryRequestQuery = {
  storeId: string;
}
type createCategoryRequestBody = {
  name: string;
  ruleType: CategoryType;
  addFoodList?: string[];
  removeFoodList?: string[];
  query?: string;
}
router.post<string, undefined, commonResponse, createCategoryRequestBody, createCategoryRequestQuery>("/create", async function(req, res) {
  const storeId = req.query.storeId
  const body = req.body
  if (body.ruleType === CategoryType.SELECTED_CATEGORY) {
    const category = new Category({
      storeId,
      name: body.name,
      ruleType: body.ruleType,
    })
    const saveRes = await category.save()
    const categoryId = saveRes.dataValues.id
    
    await FoodCategory.destroy({
      where: {
        storeId,
        categoryId,
        foodId: {
          [Op.in]: body.removeFoodList || [],
        }
      }
    })

    const list = FoodCategory.bulkBuild((body.addFoodList || []).map(item => ({
      storeId,
      categoryId,
      foodId: item,
    })))

    await Promise.all(list.map(item => item.save()))

    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } else {
    const category = new Category({
      storeId,
      name: body.name,
      ruleType: body.ruleType,
      query: body.query,
    })
    await category.save()

    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  }
})

type getCategoryRequestParam = {
  categoryId: string;
}
type getCategoryRequestQuery = {
  storeId: string;
}
type getCategoryResponse = {
  name: string;
  ruleType: CategoryType;
  foodList?: string[];
  query?: string;
}
router.get<string, getCategoryRequestParam, commonResponse<getCategoryResponse>, undefined, getCategoryRequestQuery>("/:categoryId", async function(req, res) {
  const categoryId = req.params.categoryId
  const storeId = req.query.storeId
  const category = await Category.findOne({
    where: {
      id: categoryId,
      storeId,
      deleted: false,
    }
  })
  if (!category) {
    throw new Error()
  }
  const categoryData = category.dataValues;
  if (categoryData.ruleType === CategoryType.SELECTED_CATEGORY) {
    const foodList = await FoodCategory.findAll({
      where: {
        storeId,
        categoryId,
      }
    })
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        name: categoryData.name,
        ruleType: categoryData.ruleType,
        foodList: foodList.map(item => item.dataValues.foodId),
      }
    ))
  } else {
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        name: categoryData.name,
        ruleType: categoryData.ruleType,
        query: categoryData.query,
      }
    ))
  }
})


type updateCategoryRequestParam = {
  categoryId: string;
}
type updateCategoryRequestQuery = {
  storeId: string;
}
type updateCategoryRequestBody = {
  name: string;
  ruleType: CategoryType;
  addFoodList?: string[];
  removeFoodList?: string[];
  query?: string;
}
router.put<string, updateCategoryRequestParam, commonResponse, updateCategoryRequestBody, updateCategoryRequestQuery>("/:categoryId", async function(req, res) {
  const categoryId = req.params.categoryId
  const storeId = req.query.storeId
  const body = req.body
  const category = await Category.findOne({
    where: {
      id: categoryId,
      storeId,
    }
  })
  if (category) {
    category.set("name", body.name)
    category.set("ruleType", body.ruleType)
    category.set("query", body.query || "")
    await category.save()
    if (body.ruleType === CategoryType.SELECTED_CATEGORY) {
      await FoodCategory.destroy({
        where: {
          storeId,
          categoryId,
          foodId: {
            [Op.in]: body.removeFoodList || [],
          }
        }
      })
      const list = FoodCategory.bulkBuild((body.addFoodList || []).map(item => ({
        storeId,
        categoryId,
        foodId: item,
      })))
  
      await Promise.all(list.map(item => item.save()))
      res.status(200).send(generateResponse(API_CODES.SUCCESS))
    } else {
      res.status(200).send(generateResponse(API_CODES.SUCCESS))
    }
  } else {
    throw new Error()
  }
})

type deleteCategoryRequestQuery = {
  storeId: string;
}
type deleteCategoryRequestBody = {
  categoryIds: string[];
}
router.delete<string, undefined, commonResponse, deleteCategoryRequestBody, deleteCategoryRequestQuery>("/delete", async function (req, res) {
  const storeId = req.query.storeId
  const categoryIds = req.body.categoryIds
  const categoryList = await Category.findAll({
    where: {
      storeId,
      deleted: false,
      id: {
        [Op.in]: categoryIds
      }
    },
  })
  Promise.all(categoryList.map(item => item.set("deleted", true).save()))
  res.status(200).send(generateResponse(API_CODES.SUCCESS))
})

export default router;
