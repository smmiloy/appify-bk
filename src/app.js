import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import { NODE_ENV } from "./utils/env.js";
import { globalErrorHandler, urlNotFound } from "./errors/index.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

morgan.token("date-local", () => new Date().toLocaleString());
morgan.token(
  "origin",
  (req) =>
    req.headers["user-agent"] ||
    req.headers["origin"] ||
    req.headers["referer"] ||
    "unknown",
);

app.use(
  morgan("[:date-local] :method :url :status :origin - :response-time ms"),
);

app.use(express.json());
app.use(cookieParser());

app.use((req, _res, next) => {
  if (req.body && NODE_ENV == "development") {
    console.log("Body", req.body);
  }
  next();
});

app.use("/task-api/v1", router);

app.get("/task-api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "API is healthy",
  });
});

app.get("/task-api/v1", (req, res) => {
  res.send("Welcome to the API");
});

app.use(urlNotFound);
app.use(globalErrorHandler);

export default app;
