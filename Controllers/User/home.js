const { default: mongoose } = require("mongoose");
const { error, success } = require("../../ApiResponse/apiResponse");
const Post = require("../../Models/User/posts");

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
      "./public",
      ""
    )}${req.files[0].filename}`;
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
    const post = await Post.findById(req.params.id).populate("userId");
    return res.status(200).json(success("Success", { post }, res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};
