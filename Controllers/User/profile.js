const { error, success } = require("../../ApiResponse/apiResponse");
const User = require("../../Models/User/user");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(200).json(error("Invalid Token", res.statusCode));
    }
    return res.status(200).json(success("Success", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("error", res.statusCode));
  }
};
