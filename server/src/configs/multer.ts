import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, path.join(__dirname, "../publics/images"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const name = Date.now().toString() + "_" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage });
export default upload;