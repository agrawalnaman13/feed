const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentPost: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: {} },
  { collection: "Post" }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
