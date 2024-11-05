import express from 'express';
import API_CODES from '../utils/API_CODES';
import Store from '../model/Store';
import { commonResponse, generateResponse } from './../utils';

const router = express.Router();

type getStoreRequestBody = {
  accountId: string
}
type getStoreResponse = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
}
router.get<string, undefined, commonResponse<getStoreResponse | undefined>, getStoreRequestBody>('/info', async function(req, res) {
  const accountId = req.body.accountId
  const store = await Store.findOne({
    where: {
      accountId: accountId
    }
  })
  if (store) {
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        id: store.dataValues.id,
        name: store.dataValues.name,
        address: store.dataValues.address,
        ownerName: store.dataValues.ownerName,
      }
    ))
  } else {
    res.status(200).send(generateResponse(API_CODES.STORE_UNFIND, undefined, '找不到门店'))
  }
});

type updateStoreInfoRequestParam = {
  id: string;
}
type updateStoreInfoRequestBody = {
  name: string;
  address: string;
  ownerName: string;
}
router.put<string, updateStoreInfoRequestParam, commonResponse, updateStoreInfoRequestBody>("/info/:id", async function(req, res) {
  const id = req.params.id;
  const body = req.body;
  const store = await Store.findOne({
    where: {
      id: id,
    }
  })
  if (store) {
    store.set("name", body.name)
    store.set("address", body.address)
    store.set("ownerName", body.ownerName)
    await store.save();
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } else {
    res.status(200).send(generateResponse(API_CODES.STORE_UNFIND, undefined, '找不到门店'))
  }
})

export default router;
