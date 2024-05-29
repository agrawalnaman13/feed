const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: false,
    },
    country_code: {
      type: String,
      required: false,
    },
    country_short_name: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
    },
    expire_time: {
      type: Date,
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
      default: "",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: {} },
  { collection: "User" }
);
UserSchema.methods.correctPassword = async (
  passwordFromDatabase,
  passwordFromFrontend
) => {
  return await bcrypt.compare(passwordFromDatabase, passwordFromFrontend);
};

UserSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

UserSchema.pre("save", async function (next) {
  console.log(this.isModified("password"));
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 7);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    "ultra-security",
    {
      expiresIn: "90d",
    }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
