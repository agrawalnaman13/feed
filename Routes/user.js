const express = require("express");
const { signup, login } = require("../Controllers/User/auth");
const tokenUserAuthorisation = require("../middleware/tokenUserAuth");
const { getMyProfile } = require("../Controllers/User/profile");
const {
  createUserMediaPath,
  uploadUserMedia,
} = require("../helpers/uploadImage");
const {
  addPost,
  getPostDetail,
  getSimilarPost,
} = require("../Controllers/User/home");
const router = express.Router();

//Auth
router.post("/signup", signup);
router.patch("/login", login);

//Profile
router.get("/getMyProfile", tokenUserAuthorisation, getMyProfile);

router.post(
  "/addPost",
  tokenUserAuthorisation,
  createUserMediaPath,
  uploadUserMedia.any(),
  addPost
);
router.get("/getPostDetail/:id", tokenUserAuthorisation, getPostDetail);
router.get("/getSimilarPost/:id", tokenUserAuthorisation, getSimilarPost);

module.exports = router;
