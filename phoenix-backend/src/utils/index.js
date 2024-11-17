const API_CODES = require("./API_CODES");
const crypto = require("crypto");
const { JWT_SCRECT } = require("./config");
const jsonwebtoken = require("jsonwebtoken");
const Account = require("../model/Account");
const Store = require("../model/Store");
const Employee = require("../model/Employee");
const { ROLE } = require("./constants");

const generateResponse = (code, data, message) => {
  return {
    code,
    data,
    message: code === API_CODES.SUCCESS ? "Success": message
  }
}

const encodeWithHash = (code) => {
  return crypto.createHash('sha256').update(code).digest('hex');
}

module.exports = {
  generateResponse,
  encodeWithHash,
}
