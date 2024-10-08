"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const multer_1 = __importDefault(require("../configs/multer"));
const authToken_1 = __importDefault(require("../middlewares/authToken"));
const router = express_1.default.Router();
router.use(authToken_1.default);
router.get("/get-room", ChatController_1.default.getRoom);
router.post("/create-room", multer_1.default.single("image"), ChatController_1.default.createRoom);
router.get("/get-chat/:roomId", ChatController_1.default.getChat);
router.post("/create-chat", ChatController_1.default.createChat);
exports.default = router;
