import express from 'express';
import Account, { ROLE } from './../model/Account';
import API_CODES from './../utils/API_CODES';
import { UniqueConstraintError } from 'sequelize';
import Store from './../model/Store';
import jwt from "jsonwebtoken";
import { encodeWithHash } from './../utils/crypto';
import { JWT_SCRECT } from './../utils/config';
import { commonResponse, generateResponse } from './../utils';

const router = express.Router();

type registerRequestBody = {
  userName: string;
  telephoneNumber: string;
  password: string;
  storeName: string;
  storeAddress: string;
}
router.post<string, undefined, commonResponse, registerRequestBody>('/register', async function(req, res) {
  const body = req.body
  try {
    const saveAccountRes = await new Account({
      telephone: body.telephoneNumber,
      password: body.password,
      role: ROLE.STORE_MANAGER,
    }).save()
    await new Store({
      name: body.storeName,
      ownerName: body.userName,
      address: body.storeAddress,
      accountId: saveAccountRes.dataValues.id,
    }).save()
    res.status(200).send(generateResponse(API_CODES.SUCCESS));
  } catch (e) {
    if (e instanceof UniqueConstraintError && e.errors.find(item => item.path === "telephone")) {
      res.status(200).send(generateResponse(API_CODES.REGISTER_TELEPHONE_REPEAT, undefined, "手机号码已存在"))
    } else {
      throw e;
    }
  }
});

type loginRequestBody = {
  telephoneNumber: string;
  password: string;
}
type loginResponse = {
  token: string;
}
router.post<string, undefined, commonResponse<loginResponse | undefined>, loginRequestBody>("/login", async function(req, res) {
  const body = req.body;
  const account = await Account.findOne({
    where: {
      telephone: body.telephoneNumber,
      password: encodeWithHash(body.password),
    }
  })
  if (account) {
    res.status(200).send(generateResponse(
      API_CODES.SUCCESS,
      {
        token: jwt.sign(
          {
            token: account.dataValues.token
          },
          JWT_SCRECT,
          {
            expiresIn: '100h',
          })
      }
    ))
  } else {
    res.status(200).send(generateResponse(API_CODES.LOGIN_ACCOUNT_ERROR, undefined, '账号密码错误'))
  }
})

export default router;
