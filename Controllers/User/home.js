const { default: mongoose } = require("mongoose");
const { error, success } = require("../../ApiResponse/apiResponse");
const Post = require("../../Models/User/posts");
const Bookmark = require("../../Models/User/bookmark");

exports.addPost = async (req, res) => {
  try {
    req.body.tags = JSON.parse(req.body.tags);
    const { tags } = req.body;
    console.log(req.body, req.files);
    if (!req.files?.length) {
      return res
        .status(200)
        .json(error("Please provide image", res.statusCode));
    }
    const image = `${process.env.BASE_URL}${req.files[0].destination.replace(
      "./public/",
      ""
    )}/${req.files[0].filename}`;
    const post = await Post.create({
      userId: req.user._id,
      image,
      tags,
    });
    return res
      .status(200)
      .json(success("Post Added Successfully", { post }, res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};

exports.getPostDetail = async (req, res) => {
  try {
    const post = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "users",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          localField: "_id",
          foreignField: "postId",
          from: "bookmarks",
          as: "bookmarks",
          pipeline: [
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
          ],
        },
      },
      { $addFields: { isBookmarked: { $gt: [{ $size: "$bookmarks" }, 0] } } },
      { $unset: "bookmarks" },
    ]);
    return res
      .status(200)
      .json(
        success("Success", { post: post.length ? post[0] : {} }, res.statusCode)
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};

exports.getSimilarPost = async (req, res) => {
  try {
    const post = await Post.find({ _id: { $ne: req.params.id } }).populate(
      "userId"
    );
    return res.status(200).json(success("Success", { post }, res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};

exports.bookmark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(200).json(error("Invalid post id", res.statusCode));
    }
    const isBookmarked = await Bookmark.findOne({
      userId: req.user._id,
      postId: req.params.id,
    });
    let msg = "";
    if (isBookmarked) {
      await Bookmark.findByIdAndDelete(isBookmarked._id);
      msg = "Bookmark Removed";
    } else {
      await Bookmark.create({
        userId: req.user._id,
        postId: req.params.id,
      });
      msg = "Post Bookmarked";
    }
    return res.status(200).json(success(msg, {}, res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};
