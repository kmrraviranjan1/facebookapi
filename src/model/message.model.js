const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
