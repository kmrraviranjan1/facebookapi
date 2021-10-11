const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    message: { type: "string", required: true },
    read: { type: Boolean, required: false, default: false },
    at: { type: String, required: false, default: Date.now() },
  },
  { versionKey: false, timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
