"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../publics/images"));
    },
    filename: (req, file, cb) => {
        const name = Date.now().toString() + "_" + file.originalname;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
