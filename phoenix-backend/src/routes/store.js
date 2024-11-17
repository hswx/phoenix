const express = require("express");
const API_CODES = require("../utils/API_CODES");
const Store = require("../model/Store");
const { generateResponse } = require("../utils");

const router = express.Router();

router.get('/info', async function(req, res) {
  const storeId = req.body.storeId
  const store = await Store.findOne({
    where: {
      id: storeId
    }
  })
  if (store) {
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        name: store.dataValues.name,
        address: store.dataValues.address,
        ownerName: store.dataValues.ownerName,
      }
    ))
  } else {
    res.status(200).send(generateResponse(API_CODES.STORE_UNFIND))
  }
});

router.put("/info", async function(req, res) {
  const body = req.body
  const store = await Store.findOne({
    where: {
      id: body.storeId,
    }
  })
  if (store) {
    store.set("name", body.name)
    store.set("address", body.address)
    store.set("ownerName", body.ownerName)
    await store.save();
    res.status(200).send(generateResponse(API_CODES.SUCCESS))
  } else {
    res.status(200).send(generateResponse(API_CODES.STORE_UNFIND))
  }
})

module.exports = router
