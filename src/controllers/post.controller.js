import Post from "../models/post.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
export const createPost = catchAsync(async (req, res, next) => {
  const { text, image, visibility } = req.body;

  const payload = {
    text,
    image,
    visibility,
    author: req.user.id,
  };

  const post = await Post.create(payload);

  return res.status(201).json({
    success: true,
    message: "Post Created",
    data: post,
  });
});

export const getPosts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  await Post.populate(posts, [
    { path: "author", select: "fullName avatar" },
    {
      path: "comments",
      populate: [
        { path: "author", select: "fullName avatar" },
        {
          path: "replies",
          populate: { path: "author", select: "name username avatar" },
        },
      ],
    },
  ]);

  const total = await Post.countDocuments();

  res.status(200).json({
    success: true,
    results: posts.length,
    data: posts,
    meta: {
      total,
      offset,
      limit,
      hasMore: offset + posts.length < total,
    },
  });
});

export const createLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new AppError("Invalid post id", 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyLiked) {
    return next(new AppError("You have already liked this post.", 400));
  }

  post.likes.push(userId);

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post liked successfully.",
    likesCount: post.likes.length,
  });
});

export const removeLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new AppError("Invalid post id", 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!alreadyLiked) {
    return next(new AppError("You haven't liked this post yet.", 400));
  }

  post.likes.pull(userId);

  await post.save();

  res.status(200).json({
    success: true,
    message: "Like removed successfully.",
    likesCount: post.likes.length,
  });
});
