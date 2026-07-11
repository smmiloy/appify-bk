import Post from "../models/post.model.js";
import catchAsync from "../utils/catchAsync.js";

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

export const getPosts = catchAsync(async (req, res, next) => {
  const { limit = 10, offset = 0 } = req.body;

  const safeLimit = Number(limit) || 10;
  const safeOffset = Number(offset) || 0;

  const posts = await Post.find()
    .sort("-createdAt")
    .skip(safeOffset)
    .limit(safeLimit);

  //   await Post.populate(posts, {
  //     path: "comments",
  //     options: {
  //       sort: { createdAt: -1 },
  //     },
  //     populate: {
  //       path: "replies",
  //       options: {
  //         sort: { createdAt: -1 },
  //       },
  //     },
  //   });

  return res.status(200).json({
    success: true,
    results: posts.length,
    data: posts,
    meta: {
      total: await Post.countDocuments(),
    },
  });
});
