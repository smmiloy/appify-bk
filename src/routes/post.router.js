import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createPost,
  getPosts,
  createLike,
  removeLike,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.use(protect, restrictTo("user"));
postRouter.post("/:postId/like", protect, createLike);

postRouter.delete("/:postId/like", protect, removeLike);
postRouter.route("/").post(createPost).get(getPosts);

export default postRouter;
