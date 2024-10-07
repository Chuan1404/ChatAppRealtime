import express from "express"
import chatController from "../controllers/ChatController";
import upload from "../configs/multer";
import authToken from "../middlewares/authToken";

const router = express.Router();

router.use(authToken);
router.get("/get-room", chatController.getRoom);
router.post("/create-room", upload.single("image"), chatController.createRoom);

router.get("/get-chat/:roomId", chatController.getChat);
router.post("/create-chat", chatController.createChat);

export default router