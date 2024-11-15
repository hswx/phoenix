import express from 'express';
import { generateResponse } from './../../utils';
import API_CODES from './../../utils/API_CODES';
import Store from './../../model/Store';

const router = express.Router();

router.get("/:storeId", async (req, res) => {
  const storeId = req.params.storeId as string
  const store = await Store.findOne({
    where: {
      id: storeId
    }
  })

  if (!store) {
    throw new Error()
  }

  res.status(200).send(generateResponse(
    API_CODES.SUCCESS,
    {
      name: store.dataValues.name,
      address: store.dataValues.address,
    }
  ))
})

export default router;
