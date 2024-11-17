const { google } = require("googleapis");
const path = require("path");

const DBCONFIG = {
  DB_NAME: "phoenix",
  USER_NAME: "root",
  DB_PASSWORD: "123456",
  DB_HOST: "127.0.0.1",
  DB_PORT: "3306",
  DB_TYPE: "mysql",
};

const LOCAL_SERVICE_HOST = "https://127.0.0.1:3001"
const FILE_SERVICE_HOST = "http://127.0.0.1:3002"
const ELECTRON_FRONTEND_HOST = "http://localhost:3000"
const MOBILE_FRONETNE_HOST = "http://192.168.31.175:3004"

const JWT_SCRECT = Buffer.from("phoenix", "base64")

const GOOGLE_SERVICE_ACCOUNT_FILE = path.join(__dirname, 'driven-slice-149101-ebd49ca5628f.json');
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/androidmanagement"
const GOOGLE_ENTERPRISE_ID = "enterprises/LC02uhvvn7"
const GOOGLE_CLIENT = new google.auth.JWT({
  keyFile: GOOGLE_SERVICE_ACCOUNT_FILE,
  scopes: [GOOGLE_SCOPE],
})
const GOOGLE_ENROLLMENT_URL = "https://enterprise.google.com/android/enroll?et="


module.exports = {
  DBCONFIG,
  LOCAL_SERVICE_HOST,
  FILE_SERVICE_HOST,
  ELECTRON_FRONTEND_HOST,
  MOBILE_FRONETNE_HOST,
  JWT_SCRECT,
  GOOGLE_SERVICE_ACCOUNT_FILE,
  GOOGLE_SCOPE,
  GOOGLE_ENTERPRISE_ID,
  GOOGLE_CLIENT,
  GOOGLE_ENROLLMENT_URL,
};
