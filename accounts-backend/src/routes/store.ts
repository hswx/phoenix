import express, { Request } from 'express';
import API_CODES from '../utils/API_CODES';
import Store from '../model/Store';

const router = express.Router();

type getStoreRequestBody = {
  accountId: string
}
type getStoreResponseBody = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
}
router.get('/info', async function(req: Request<{}, getStoreResponseBody, getStoreRequestBody>, res) {
  const accountId = req.body.accountId
  const store = await Store.findOne({
    where: {
      accountId: accountId
    }
  })
  if (store) {
    res.sendResponse(API_CODES.SUCCESS, {
      id: store.dataValues.id,
      name: store.dataValues.name,
      address: store.dataValues.address,
      ownerName: store.dataValues.ownerName,
    })
  } else {
    res.sendResponse(API_CODES.STORE_UNFIND, undefined, '找不到门店')
  }
});

type updateStoreInfoRequestBody = {
  name: string;
  address: string;
  ownerName: string;
}
router.put("/info/:id", async function(req: Request<{id: string}, undefined, updateStoreInfoRequestBody>, res) {
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
    res.sendResponse(API_CODES.SUCCESS)
  } else {
    res.sendResponse(API_CODES.STORE_UNFIND, undefined, '找不到门店')
  }
})

export default router;
