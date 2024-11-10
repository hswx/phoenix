import { google } from "googleapis";
import path from "path";

export const DB_NAME = "phoenix"
export const USER_NAME = "root"
export const DB_PASSWORD = "123456"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = "3306"
export const DB_TYPE = "mysql"

export const JWT_SCRECT = Buffer.from("phoenix", "base64")

export const LOCAL_SERVICE_HOST = "https://127.0.0.1:3001"
export const FILE_SERVICE_HOST = "http://127.0.0.1:3002"

export const GOOGLE_SERVICE_ACCOUNT_FILE = path.join(__dirname, 'driven-slice-149101-ebd49ca5628f.json');
export const GOOGLE_SCOPE = "https://www.googleapis.com/auth/androidmanagement"
export const GOOGLE_ENTERPRISE_ID = "enterprises/LC02uhvvn7"
export const GOOGLE_CLIENT = new google.auth.JWT({
  keyFile: GOOGLE_SERVICE_ACCOUNT_FILE,
  scopes: [GOOGLE_SCOPE],
})
