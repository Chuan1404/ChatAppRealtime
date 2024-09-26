const ChatRoomModel = require("../models/ChatRoomModel");
const ChatMessageModel = require("../models/ChatMessageModel");

class ChatController {
  // [POST] /chat/create-room
  async createRoom(req, res) {
    const body = req.body

    body.members = req.body.members ? JSON.parse(req.body.members) : [];

    if (req.file) {
      req.body.image = "images/" + req.file.filename;
    }

    // room between 2 people
    if (body.type == 1) {
      let room = await ChatRoomModel.findOne({
        members: { $all: body.members, $size: body.members.length },
      });

      if (!room) {
        room = await ChatRoomModel.create(body);
      }

      return res.status(200).json({
        data: room,
      });
    }

    // room among many people
    else if (body.type == 2) {

      let room = await ChatRoomModel.create(body);

      return res.status(200).json({
        data: room,
      });
    } else {
      return res.status(400).json({
        error: "Something error !",
      });
    }
  }

  // [GET] /chat/get-room
  async getRoom(req, res) {
    let userId = req.userId;
    const rooms = await ChatRoomModel.find({
      members: { $all: [userId] },
    }).populate("members");

    if (rooms) {
      return res.status(200).json({
        data: rooms,
      });
    } else {
      return res.status(400).json({
        error: "Something error !",
      });
    }
  }

  // [POST] /chat/create-chat
  async createChat(req, res) {
    let messageModel = new ChatMessageModel(req.body);

    try {
      let saveResult = await messageModel.save();

      return res.status(200).json({
        data: saveResult,
      });
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  }

  // [GET] /chat/get-chat
  async getChat(req, res) {
    let chatRoomId = req.params.roomId;
    let chats = await ChatMessageModel.find({ chatRoomId }).populate(
      "senderObject"
    );
    if (chats) {
      return res.status(200).json({
        data: chats,
      });
    } else {
      return res.status(400).json({
        error: "Something error !",
      });
    }
  }
}

module.exports = new ChatController();
