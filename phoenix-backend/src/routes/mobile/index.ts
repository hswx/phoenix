import express from 'express';
import foodRouter from "./food";
import storeRouter from "./store";
import orderRouter from "./order";

const router = express.Router();

router.use("/food", foodRouter);
router.use("/store", storeRouter);
router.use("/order", orderRouter);

export default router;
