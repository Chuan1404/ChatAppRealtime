const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatRoomSchema = new Schema(
  {
    members: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    name: {
      type: String,
      require: true
    },
    image: {
      type: String,
    },
    type: {
      type: Number,
      default: 1, // 1 - persional chat, 2 - group chat
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
