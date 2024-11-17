const express = require("express");
const foodRouter = require("./food");
const storeRouter = require("./store");
const orderRouter = require("./order");
const authRouter = require("./auth");

const router = express.Router();

router.use("/food", foodRouter);
router.use("/store", storeRouter);
router.use("/order", orderRouter);
router.use("/auth", authRouter);

module.exports = router;
