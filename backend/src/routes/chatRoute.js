const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");
const authToken = require("../utils/authToken");

router.use(authToken);
router.get("/get-room", chatController.getRoom);
router.post("/create-room", chatController.createRoom);

router.get("/get-chat/:roomId", chatController.getChat);
router.post("/create-chat", chatController.createChat);

module.exports = router;
