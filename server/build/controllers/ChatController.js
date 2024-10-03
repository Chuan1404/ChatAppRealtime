"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatRoomModel_1 = __importDefault(require("../models/ChatRoomModel"));
const ChatMessageModel_1 = __importDefault(require("../models/ChatMessageModel"));
const constants_1 = require("../common/constants");
class ChatController {
    // [POST] /chat/create-room
    createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            body.members = req.body.members ? JSON.parse(req.body.members) : [];
            if (req.file) {
                req.body.image = "images/" + req.file.filename;
            }
            // room between 2 people
            if (body.type == constants_1.ROOM_TYPE.PERSIONAL) {
                let room = yield ChatRoomModel_1.default.findOne({
                    members: { $all: body.members, $size: body.members.length },
                });
                if (!room) {
                    room = yield ChatRoomModel_1.default.create(body);
                }
                return res.status(200).json({
                    data: room,
                });
            }
            // room among many people
            else if (body.type == constants_1.ROOM_TYPE.GROUP) {
                let room = yield ChatRoomModel_1.default.create(body);
                return res.status(200).json({
                    data: room,
                });
            }
            else {
                return res.status(400).json({
                    error: "Something error !",
                });
            }
        });
    }
    // [GET] /chat/get-room
    getRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    return res.status(400).json({
                        error: "User ID is missing.",
                    });
                }
                const rooms = yield ChatRoomModel_1.default.find({
                    members: { $all: [userId] },
                }).populate("members", "_id username"); // Populate only specific fields
                if (rooms.length > 0) {
                    return res.status(200).json({
                        data: rooms,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "No rooms found for the user.",
                    });
                }
            }
            catch (error) {
                console.error("Error fetching rooms: ", error);
                return res.status(500).json({
                    error: "Internal server error.",
                });
            }
        });
    }
    // [POST] /chat/create-chat
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let messageModel = new ChatMessageModel_1.default(req.body);
            try {
                let saveResult = yield messageModel.save();
                return res.status(200).json({
                    data: saveResult,
                });
            }
            catch (err) {
                return res.status(400).json({
                    error: err,
                });
            }
        });
    }
    // [GET] /chat/get-chat
    getChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomId = req.params.roomId;
            let chats = yield ChatMessageModel_1.default.find({ chatRoomId }).populate("senderObject");
            if (chats) {
                return res.status(200).json({
                    data: chats,
                });
            }
            else {
                return res.status(400).json({
                    error: "Something error !",
                });
            }
        });
    }
}
exports.default = new ChatController();
