const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema(
  {
    senderId: {
      type: String,
      ref: "User",
    },
    chatRoomId: {
      type: String,
      ref: "ChatRoom",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

chatMessageSchema.virtual("senderObject", {
  ref: "User",
  localField: "senderId",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtuals are included in the output
chatMessageSchema.set('toJSON', { virtuals: true });
chatMessageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
