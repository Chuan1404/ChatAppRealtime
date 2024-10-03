"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const authToken_1 = __importDefault(require("../utils/authToken"));
const router = express_1.default.Router();
router.use(authToken_1.default);
router.get('/get-info', UserController_1.default.getInfo);
router.get('/get-list', UserController_1.default.getList);
exports.default = router;
