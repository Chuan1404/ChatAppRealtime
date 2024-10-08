import { Request, Response } from "express";
import ChatRoomModel from "../models/ChatRoomModel";
import ChatMessageModel from "../models/ChatMessageModel";
import { ROOM_TYPE } from "../common/constants";

class ChatController {
  // [POST] /chat/create-room
  async createRoom(req: Request, res: Response): Promise<void> {
    const body = req.body;

    body.members = req.body.members ? JSON.parse(req.body.members) : [];

    if (req.file) {
      req.body.image = "images/" + req.file.filename;
    }

    // room between 2 people
    if (body.type == ROOM_TYPE.PERSIONAL) {
      let room = await ChatRoomModel.findOne({
        members: { $all: body.members, $size: body.members.length },
      });

      if (!room) {
        room = await ChatRoomModel.create(body);
      }

      res.status(200).json({
        data: room,
      });
    }

    // room among many people
    else if (body.type == ROOM_TYPE.GROUP) {
      let room = await ChatRoomModel.create(body);

      res.status(200).json({
        data: room,
      });
    } else {
      res.status(400).json({
        error: "Something error !",
      });
    }
  }

  // [GET] /chat/get-room
  async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(400).json({
          error: "User ID is missing.",
        });
        return;
      }

      const rooms = await ChatRoomModel.find({
        members: { $all: [userId] },
      }).populate("members", "_id username"); // Populate only specific fields

      if (rooms.length > 0) {
        res.status(200).json({
          data: rooms,
        });
      } else {
        res.status(404).json({
          error: "No rooms found for the user.",
        });
      }
    } catch (error) {
      console.error("Error fetching rooms: ", error);
      res.status(500).json({
        error: "Internal server error.",
      });
    }
  }

  // [POST] /chat/create-chat
  async createChat(req: Request, res: Response): Promise<void> {
    let messageModel = new ChatMessageModel(req.body);

    try {
      let saveResult = await messageModel.save();

      res.status(200).json({
        data: saveResult,
      });
    } catch (err) {
      res.status(400).json({
        error: err,
      });
    }
  }

  // [GET] /chat/get-chat
  async getChat(req: Request, res: Response): Promise<void> {
    let chatRoomId = req.params.roomId;
    let chats = await ChatMessageModel.find({ chatRoomId }).populate(
      "senderObject"
    );
    if (chats) {
      res.status(200).json({
        data: chats,
      });
    } else {
      res.status(400).json({
        error: "Something error !",
      });
    }
  }
}

export default new ChatController();
