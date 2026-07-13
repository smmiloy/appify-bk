import express from "express";
import authRouter from "./auth.router.js";
import commentRouter from "./comment.router.js";
import postRouter from "./post.router.js";

import upload from "../utils/multer.js";
import { uploadFile } from "../controllers/file.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

router.post(
  "/file-upload",
  //   protect,
  //   restrictTo("user", "admin"),
  //   upload.single("image"),
  upload.single("file"),
  uploadFile,
);

export default router;
