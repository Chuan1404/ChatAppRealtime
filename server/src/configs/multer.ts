import { Request } from "express";

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const name = Date.now().toString() + "_" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage });
export default upload;