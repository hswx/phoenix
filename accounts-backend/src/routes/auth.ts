import express, { Request } from 'express';
import Account from './../model/Account';
import API_CODES from './../utils/API_CODES';
import { UniqueConstraintError } from 'sequelize';
const router = express.Router();

type registerBody = {
  userName: string;
  telephoneNumber: string;
  password: string;
  storeName: string;
  storeAddress: string;
}
router.post('/register', async function(req: Request<{}, {}, registerBody>, res) {
  const body = req.body
  try {
    await new Account({
      telephone: body.telephoneNumber,
      password: body.password,
    }).save()
    res.sendResponse(API_CODES.SUCCESS)
  } catch (e) {
    if (e instanceof UniqueConstraintError && e.errors.find(item => item.path === "telephone")) {
      res.sendResponse(API_CODES.REGISTER_TELEPHONE_REPEAT, undefined, "手机号码已存在")
    } else {
      throw e;
    }
  }
});

export default router;
