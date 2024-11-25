const express = require("express");
const Employee = require("../../model/Employee");
const Food = require("../../model/Food");
const Store = require("../../model/Store");
const Category = require("../../model/Category");
const FoodCategory = require("../../model/FoodCategory");
const API_CODES = require("../../utils/API_CODES");
const { generateResponse } = require("../../utils");
const { CATEGORY_TYPE } = require("../../utils/constants");
const { sequelizeInstance } = require("../../dao/db");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const body = req.body
    const employee = await Employee.findOne({
      where: { id: body.employeeId },
    });

    if (!employee) {
      throw new Error();
    }

    const store = await Store.findOne({
      where: {id: employee.dataValues.storeId}
    })

    if (!store) {
      throw new Error();
    }

    const foodList = await Food.findAll({
      where: {
        storeId: store.dataValues.id,
        deleted: false,
        soldOut: false,
      },
      order: [['createdAt', 'DESC']]
    });

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
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.get("/fullist", async (req, res) => {
  try {
    const body = req.body
    const employee = await Employee.findOne({
      where: { id: body.employeeId },
    });

    if (!employee) {
      throw new Error();
    }

    const store = await Store.findOne({
      where: {id: employee.dataValues.storeId}
    })

    if (!store) {
      throw new Error();
    }

    const categoryListRes = await Category.findAll({
      where: {
        storeId: store.dataValues.id,
        deleted: false,
      },
      order: [['createdAt', 'DESC']]
    })

    const categoryList = await Promise.all(categoryListRes.map(async item => {
      const category = item.dataValues
      if (category.ruleType === CATEGORY_TYPE.DYNAMIC_CATEGORY) {
        const resList = await sequelizeInstance.query(`SELECT * FROM foods WHERE ${category.query}`, {
          model: Food,
          mapToModel: true,
        })
        return {
          id: category.id,
          name: category.name,
          foodList: resList.filter(item => (
            item.dataValues.storeId === store.dataValues.id &&
            item.dataValues.deleted !== true &&
            item.dataValues.soldOut !== true
          )).map(item => ({
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
            categoryId: category.id,
          }
        })
  
        const foodList = await Promise.all(foodCategoryListRes.map(async item => {
          const foodCategoryRes = item.dataValues
          const foodRes = await Food.findOne({
            where: {
              storeId: store.dataValues.id,
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
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router;
