"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Account_1 = __importDefault(require("./../model/Account"));
const router = express_1.default.Router();
router.post('/register', function (req, res) {
    const body = req.body;
    console.log(1001);
    new Account_1.default({
        telephone: body.telephoneNumber,
        password: body.password,
    }).save();
});
exports.default = router;
