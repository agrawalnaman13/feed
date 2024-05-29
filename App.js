const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const userRoutes = require("./Routes/user");
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true })); //for parsing body of HTML Forms
app.use(express.static("./public")); //for serving static contenct in public folder
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(morgan("tiny"));
// app.use(
//   morgan("common", {
//     stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
//       flags: "a",
//     }),
//   })
// );
// app.use(
//   morgan("common", {
//     skip: function (req, res) {
//       return res.statusCode < 400;
//     },
//     stream: fs.createWriteStream(path.join(__dirname, "error.log"), {
//       flags: "a",
//     }),
//   })
// );
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  console.log("Hello");
  res.status(200).send("Welcome");
});

module.exports = app;
