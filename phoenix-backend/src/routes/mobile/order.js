const express = require("express");
const Order = require("../../model/Order");
const OrderFood = require("../../model/OrderFood");
const API_CODES = require("../../utils/API_CODES");
const { generateResponse } = require("../../utils");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const body = req.body;
    const employeeId = body.employeeId;
    const foodList = body.foodList;
    const order = await Order.create({ employeeId })
    const orderId = order.dataValues.id
    await OrderFood.bulkCreate(foodList.map(item => ({
      orderId: orderId,
      employeeId: employeeId,
      foodId: item.id,
      name: item.name,
      imgPath: item.imgPath,
      price: item.price,
      cuisine: item.cuisine,
      flavor: item.flavor,
      count: item.count,
    })))
    res.status(200).send(generateResponse(API_CODES.SUCCESS, orderId))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.get("/list", async (req, res) => {
  try {
    const body = req.body;
    const employeeId = body.employeeId;
    const orders = await Order.findAll({
      where: {
        employeeId: employeeId,
      },
      include: [{
        model: OrderFood,
      }],
    });
    const ordersWithDetails = orders.map(order => {
      const orderData = order.dataValues;
      const totalPrice = order.order_foods.reduce((total, food) => {
        return total + food.dataValues.price;
      }, 0);
  
      const imgs = order.order_foods.map((food) => food.dataValues.imgPath);
  
      return {
        id: orderData.id,
        createdAt: orderData.createdAt,
        totalPrice,
        imgs,
      };
    });
    res.status(200).send(generateResponse(API_CODES.SUCCESS, ordersWithDetails))
  } catch (e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

router.get("/:orderId", async (req, res) => {
  try {
    const params = req.params;
    const body = req.body;
    const [order, foodList] = await Promise.all([
      Order.findOne({
        where: {
          id: params.orderId,
          employeeId: body.employeeId,
        }
      }),
      OrderFood.findAll({
        where: {
          orderId: params.orderId,
        }
      })
    ])
    if (!order) {
      throw new Error()
    }
    const orderData = order.dataValues
    const foodListData = foodList.map(item => item.dataValues)
    res.status(200).send(generateResponse(API_CODES.SUCCESS, {
      id: orderData.id,
      createdAt: orderData.createdAt,
      foodList: foodListData.map(item => ({
        id: item.id,
        name: item.name,
        imgPath: item.imgPath,
        price: item.price,
        cuisine: item.cuisine,
        flavor: item.flavor,
        count: item.count,
      }))
    }))
  } catch(e) {
    res.status(200).send(generateResponse(API_CODES.Error))
  }
})

module.exports = router
