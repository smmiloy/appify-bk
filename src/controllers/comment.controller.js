import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!mongoose.isValidObjectId(postId)) {
    return next(new AppError("Invalid post id.", 400));
  }

  if (!text || !text.trim()) {
    return next(new AppError("Comment text is required.", 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found.", 404));
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user.id,
    text: text.trim(),
  });

  post.comments.push(comment._id);
  await post.save({ validateBeforeSave: false });

  return res.status(201).json({
    success: true,
    message: "Comment created successfully.",
    data: comment,
  });
});

export const replyToComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.isValidObjectId(commentId)) {
    return next(new AppError("Invalid comment id.", 400));
  }

  if (!text || !text.trim()) {
    return next(new AppError("Reply text is required.", 400));
  }

  const parentComment = await Comment.findById(commentId);

  if (!parentComment) {
    return next(new AppError("Parent comment not found.", 404));
  }

  const reply = await Comment.create({
    post: parentComment.post,
    author: req.user.id,
    parentComment: parentComment._id,
    text: text.trim(),
  });

  parentComment.replies.push(reply._id);
  await parentComment.save({ validateBeforeSave: false });

  return res.status(201).json({
    success: true,
    message: "Reply created successfully.",
    data: reply,
  });
});

export const getCommentsByPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    return next(new AppError("Invalid post id.", 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found.", 404));
  }

  const comments = await Comment.find({ post: postId, parentComment: null })
    .sort("-createdAt")
    .populate({
      path: "replies",
      options: {
        sort: { createdAt: -1 },
      },
    });

  return res.status(200).json({
    success: true,
    results: comments.length,
    data: comments,
  });
});
