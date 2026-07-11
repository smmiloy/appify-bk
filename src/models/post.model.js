import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
