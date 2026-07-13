import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createComment,
  getCommentsByPost,
  replyToComment,
  likeComment,
  unlikeComment,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.use(protect, restrictTo("user"));
commentRouter.route("/post/:postId").post(createComment).get(getCommentsByPost);
commentRouter.route("/:commentId/reply").post(replyToComment);

commentRouter.post("/:commentId/like", likeComment);
commentRouter.delete("/:commentId/like", unlikeComment);

export default commentRouter;
