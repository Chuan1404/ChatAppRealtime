import { Request, Response } from "express";
import UserModel from "../models/UserModel";

class UserController {
  // [GET] /user/get-info
  async getInfo(req: Request, res: Response): Promise<any> {
    const id = req.userId;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    } else {
      return res.status(200).json({
        data: user,
      });
    }
  }

  // [GET] /user/get-list
  async getList(req: Request, res: Response): Promise<any> {
    const id = req.userId;
    const users = await UserModel.find({ _id: { $ne: id } });
    if (!users) {
      return res.status(400).json({
        error: "User doesn't exist",
      });
    } else {
      return res.status(200).json({
        data: users,
      });
    }
  }
}

export default new UserController();
