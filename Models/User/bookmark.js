const mongoose = require("mongoose");
const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
  { collection: "Bookmark" }
);
const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

module.exports = Bookmark;
