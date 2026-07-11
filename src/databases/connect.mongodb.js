import {
  MONGODB_STR,
  MONGODB_PASSWORD,
  MONGODB_USERNAME,
  MONGODB_APPNAME,
} from "../utils/env.js";

import mongoose from "mongoose";

const MONGODB_URI = MONGODB_STR.replace("<password>", MONGODB_PASSWORD)
  .replace("<username>", MONGODB_USERNAME)
  .replace("<appname>", MONGODB_APPNAME);

const connectToMongoDB = () => {
  return mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log("✅ Connected to the database");
    })
    .catch((error) => {
      console.log("Failed to connect database");
      console.log(error);
      process.exit(1);
    });
};

export default connectToMongoDB;
