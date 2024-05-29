const mongoose = require("mongoose");
const validator = require("validator");
const { error, success } = require("../../ApiResponse/apiResponse");
const User = require("../../Models/User/user");
// const Device = require("../../Models/User/device");
exports.signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      reference,
      share_data,
      fcmToken,
      deviceOS,
      deviceId,
    } = req.body;
    console.log(req.body);
    if (!first_name?.trim()) {
      return res
        .status(200)
        .json(error("Please provide first name", res.statusCode));
    }
    if (!last_name?.trim()) {
      return res
        .status(200)
        .json(error("Please provide last name", res.statusCode));
    }
    if (!email?.trim()) {
      return res
        .status(200)
        .json(error("Please provide email", res.statusCode));
    }
    if (!validator.isEmail(email.trim().toLowerCase())) {
      return res.status(200).json(error("Invalid email", res.statusCode));
    }
    if (!password) {
      return res
        .status(200)
        .json(error("Please provide password", res.statusCode));
    }
    // if (fcmToken) {
    //   if (!deviceOS) {
    //     return res
    //       .status(200)
    //       .json(error("Please provide deviceOS", res.statusCode));
    //   }
    //   if (!["web", "android", "ios"].includes(deviceOS)) {
    //     return res.status(200).json(error("Invalid deviceOS", res.statusCode));
    //   }
    //   if (!deviceId) {
    //     return res
    //       .status(200)
    //       .json(error("Please provide device id", res.statusCode));
    //   }
    // }
    const users = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (users) {
      return res
        .status(200)
        .json(error("Email is already registered", res.statusCode));
    }
    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      name: `${first_name.trim()} ${last_name.trim()}`,
      email: email.trim().toLowerCase(),
      password: password,
      isVerified: true,
    });
    // const otp = Math.floor(1000 + Math.random() * 9000);
    // let expire_time = moment.utc(Date.now());
    // expire_time = moment(expire_time).add(5, "minutes");
    // await User.findByIdAndUpdate(user._id, {
    //   otp: otp,
    //   expire_time: expire_time,
    // });
    return res
      .status(200)
      .json(success("User Added Successfully", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, deviceId, deviceOS, fcmToken } = req.body;
    console.log(req.body);
    if (!email?.trim()) {
      return res
        .status(200)
        .json(error("Please provide email", res.statusCode));
    }
    if (!validator.isEmail(email.trim().toLowerCase())) {
      return res.status(200).json(error("Invalid email", res.statusCode));
    }
    if (!password) {
      return res
        .status(200)
        .json(error("Please provide password", res.statusCode));
    }
    // if (fcmToken) {
    //   if (!deviceOS) {
    //     return res
    //       .status(200)
    //       .json(error("Please provide deviceOS", res.statusCode));
    //   }
    //   if (!["web", "android", "ios"].includes(deviceOS)) {
    //     return res.status(200).json(error("Invalid deviceOS", res.statusCode));
    //   }
    //   if (!deviceId) {
    //     return res
    //       .status(200)
    //       .json(error("Please provide device id", res.statusCode));
    //   }
    // }
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");
    if (!user) {
      return res
        .status(200)
        .json(error("User is not registered", res.statusCode));
    }
    if (!user.status) {
      return res
        .status(200)
        .json(error("You are not authorized to login", res.statusCode));
    }
    if (!(await user.correctPassword(password, user.password))) {
      return res.status(200).json(error("Invalid Password", res.statusCode));
    }
    const token = await user.generateAuthToken();
    // if (!user.isVerified) {
    //   const otp = Math.floor(1000 + Math.random() * 9000);
    //   user.otp = otp;
    //   let expire_time = moment.utc(Date.now());
    //   expire_time = moment(expire_time).add(5, "minutes");
    //   user.expire_time = expire_time;
    //   await user.save();
    //   sendSMS(phone_number, country_code, 1, otp);
    //   return res.status(200).json(
    //     success(
    //       "Please verify your account first",
    //       {
    //         verifyAccount: true,
    //         chooseExamType: false,
    //         purchasePlan: false,
    //         otp: otp,
    //         student,
    //       },
    //       res.statusCode
    //     )
    //   );
    // }

    return res
      .header("x-auth-token-user", token)
      .header("access-control-expose-headers", "x-auth-token-user")
      .status(200)
      .json(
        success(
          "Logged in successfully",
          {
            verifyAccount: false,
            user,
            token,
          },
          res.statusCode
        )
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json(error("error", res.statusCode));
  }
};
