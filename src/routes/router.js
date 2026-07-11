import express from "express";
import authRouter from "./auth.router.js";
import commentRouter from "./comment.router.js";
import postRouter from "./post.router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

export default router;
