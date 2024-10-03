"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../common/constants");
const { Schema } = mongoose_1.default;
const chatRoomSchema = new Schema({
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
        default: constants_1.ROOM_TYPE.PERSIONAL, // 1 - persional chat, 2 - group chat
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ChatRoom", chatRoomSchema);
