"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const chatMessageSchema = new Schema({
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
}, { timestamps: true });
chatMessageSchema.virtual("senderObject", {
    ref: "User",
    localField: "senderId",
    foreignField: "_id",
    justOne: true,
});
// Ensure virtuals are included in the output
chatMessageSchema.set('toJSON', { virtuals: true });
chatMessageSchema.set('toObject', { virtuals: true });
exports.default = mongoose_1.default.model("ChatMessage", chatMessageSchema);
