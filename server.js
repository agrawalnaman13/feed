global.__basedir = __dirname;
const app = require("./App");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://starStaging:nQ2zYmu1APv9r8Yh@cluster0.llrjflg.mongodb.net/feed?retryWrites=true&w=majority"
  )
  .then((con) => console.log("connected to remote database"));
const port = 3005;
process.env.BASE_URL = "http://ec2-52-66-186-107.ap-south-1.compute.amazonaws.com:3005/";
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
