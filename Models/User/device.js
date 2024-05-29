// const mongoose = require("mongoose");
// const DeviceSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     deviceId: {
//       type: String,
//       required: false,
//     },
//     deviceOS: {
//       type: String,
//       required: true,
//       enum: ["web", "android", "ios"],
//       default: "Web",
//     },
//     fcmToken: {
//       type: String,
//       required: false,
//     },
//     authToken: {
//       type: String,
//       required: false,
//     },
//   },
//   { timestamps: true },
//   { collection: "device" }
// );
// const Device = mongoose.model("device", DeviceSchema);

// module.exports = Device;
