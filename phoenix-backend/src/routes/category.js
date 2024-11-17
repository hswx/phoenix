const express = require("express");
const Category = require("../model/Category");
const { CATEGORY_TYPE } = require("../utils/constants");
const FoodCategory = require("../model/FoodCategory");
const API_CODES = require("../utils/API_CODES");
const { generateResponse } = require("../utils");
const { Op } = require("sequelize");
const { sequelizeInstance } = require("../dao/db");
const Food = require("../model/Food");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const body = req.body;
    const categoryList = await Category.findAll({
      where: {
        storeId: body.storeId,
        deleted: false,
      },
      order: [['createdAt', 'DESC']]
    })
    const list = await Promise.all(categoryList.map(async item => {
      const dataValue = item.dataValues;
      if (item.dataValues.ruleType === CATEGORY_TYPE.SELECTED_CATEGORY) {
        const resList = await FoodCategory.findAndCountAll({
          where: {
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
        const resList = await sequelizeInstance.query(`SELECT * FROM foods WHERE ${item.dataValues.query}`, {
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
  } catch (e) {
    res.status(200).send(generateResponse(
      API_CODES.Error
    ))
  }
})

router.post("/create", async (req, res) => {
  try {
    const body = req.body
    if (body.ruleType === CATEGORY_TYPE.SELECTED_CATEGORY) {
      const category = new Category({
        storeId: body.storeId,
        name: body.name,
        ruleType: body.ruleType,
      })

      const saveRes = await category.save()
      const categoryId = saveRes.dataValues.id
      await FoodCategory.destroy({
        where: {
          categoryId,
          foodId: {
            [Op.in]: body.removeFoodList || [],
          }
        }
      })
  
      const list = FoodCategory.bulkBuild((body.addFoodList || []).map(item => ({
        categoryId,
        foodId: item,
      })))
  
      await Promise.all(list.map(item => item.save()))
      res.status(200).send(generateResponse(API_CODES.SUCCESS))
    } else {
      const category = new Category({
        storeId: body.storeId,
        name: body.name,
        ruleType: body.ruleType,
        query: body.query,
      })
      await category.save()
  
      res.status(200).send(generateResponse(API_CODES.SUCCESS))
    }
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.get("/:categoryId", async (req, res) => {
  try {
    const body = req.body;
    const categoryId = req.params.categoryId
    const category = await Category.findOne({
      where: {
        id: categoryId,
        storeId: body.storeId,
        deleted: false,
      }
    })
    if (!category) {
      throw new Error()
    }
    const categoryData = category.dataValues;
    if (categoryData.ruleType === CATEGORY_TYPE.SELECTED_CATEGORY) {
      const foodList = await FoodCategory.findAll({
        where: {
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
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.put("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId
    const body = req.body
    const category = await Category.findOne({
      where: {
        id: categoryId,
        storeId: body.storeId,
      }
    })
    if (!category) {
      throw new Error()
    }
      category.set("name", body.name)
      category.set("ruleType", body.ruleType)
      category.set("query", body.query || "")
      await category.save()
      if (body.ruleType === CATEGORY_TYPE.SELECTED_CATEGORY) {
        await FoodCategory.destroy({
          where: {
            categoryId,
            foodId: {
              [Op.in]: body.removeFoodList || [],
            }
          }
        })
        const list = FoodCategory.bulkBuild((body.addFoodList || []).map(item => ({
          categoryId,
          foodId: item,
        })))
    
        await Promise.all(list.map(item => item.save()))
        res.status(200).send(generateResponse(API_CODES.SUCCESS))
      } else {
        res.status(200).send(generateResponse(API_CODES.SUCCESS))
      }
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.delete("/delete", async (req, res) => {
  try {
    const body = req.body;
    const categoryList = await Category.findAll({
      where: {
        storeId: body.storeId,
        deleted: false,
        id: {
          [Op.in]: body.categoryIds
        }
      },
    })
    Promise.all(categoryList.map(item => item.set("deleted", true).save()))
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
