import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

export const PORT = process.env.PORT;
export const sendEmail = true;
export const NODE_ENV = process.env.NODE_ENV;

export const MONGODB_STR = process.env.MONGODB_STR;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
export const MONGODB_APPNAME = process.env.MONGODB_APPNAME;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;
export const REFRESH_JWT_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
