import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import { createPost, getPosts } from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.use(protect, restrictTo("user"));
postRouter.route("/").post(createPost).get(getPosts);

export default postRouter;
