import express from 'express';
import Order from './../../model/Order';
import { generateResponse } from './../../utils';
import API_CODES from './../../utils/API_CODES';
import OrderFood from './../../model/OrderFood';

const router = express.Router();

router.post("/create", async (req, res) => {
  const body = req.body;
  const employeeId = body.employeeId;
  const foodList = body.foodList;

  const order = await Order.create({ employeeId })

  const orderId = order.dataValues.id
  // @ts-ignore
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
})

router.get("/list", async (req, res) => {
  const employeeId = req.query.employeeId as string

  if (!employeeId) {
    throw new Error()
  }
  const orders: any[] = await Order.findAll({
    where: {
      employeeId: employeeId,
    },
    include: [{
      model: OrderFood,
    }],
  });

  const ordersWithDetails: any = orders.map(order => {
    const orderData = order.dataValues;
    const totalPrice = order.order_foods.reduce((total: any, food: any) => {
      return total + food.dataValues.price;
    }, 0);

    const imgs = order.order_foods.map((food: any) => food.dataValues.imgPath); // 收集所有图片路径

    return {
      id: orderData.id,
      createdAt: orderData.createdAt,
      totalPrice,
      imgs,
    };
  });

  res.status(200).send(generateResponse(API_CODES.SUCCESS, ordersWithDetails))
})

router.get("/:orderId", async (req, res) => {
  const params = req.params
  try {
    const [order, foodList] = await Promise.all([
      Order.findOne({
        where: {
          id: params.orderId
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



export default router;
