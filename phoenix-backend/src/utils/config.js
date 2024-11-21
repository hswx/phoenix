const { google } = require("googleapis");

const DBCONFIG = {
  DB_NAME: process.env.DB_NAME,
  USER_NAME: process.env.USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_TYPE: process.env.DB_TYPE,
};

const FILE_SERVICE_HOST = process.env.FILE_SERVICE_HOST
const FILE_SERVICE_STATIC_HOST = process.env.FILE_SERVICE_STATIC_HOST

const JWT_SCRECT = process.env.JWT_SCRECT

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/androidmanagement"

const GOOGLE_ENTERPRISE_ID = process.env.GOOGLE_ENTERPRISE_ID
const GOOGLE_CLIENT = new google.auth.JWT({
  scopes: [GOOGLE_SCOPE],
  email: process.env.GOOGLE_MDM_EMAIL,
  key: process.env.GOOGLE_MDM_KEY.replace(/\\n/g, '\n'),
  keyId: process.env.GOOGLE_MDM_KEY_ID,
})
const GOOGLE_ENROLLMENT_URL = "https://enterprise.google.com/android/enroll?et="

module.exports = {
  DBCONFIG,
  FILE_SERVICE_HOST,
  FILE_SERVICE_STATIC_HOST,
  JWT_SCRECT,
  GOOGLE_SCOPE,
  GOOGLE_ENTERPRISE_ID,
  GOOGLE_CLIENT,
  GOOGLE_ENROLLMENT_URL,
};
