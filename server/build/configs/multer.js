"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        const name = Date.now().toString() + "_" + file.originalname;
        cb(null, name);
    },
});
const upload = multer({ storage });
exports.default = upload;
