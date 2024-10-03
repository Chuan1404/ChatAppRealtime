import mongoose from "mongoose";
import { ROOM_TYPE } from "../common/constants";
const { Schema } = mongoose;

const chatRoomSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    type: {
      type: Number,
      default: ROOM_TYPE.PERSIONAL, // 1 - persional chat, 2 - group chat
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema)