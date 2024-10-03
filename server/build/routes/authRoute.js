"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const multer_1 = __importDefault(require("../configs/multer"));
const router = express_1.default.Router();
router.post("/sign-up", multer_1.default.single("avatar"), AuthController_1.default.signUp);
router.post("/sign-in", AuthController_1.default.signIn);
router.post("/refresh-token", AuthController_1.default.refreshToken);
exports.default = router;
