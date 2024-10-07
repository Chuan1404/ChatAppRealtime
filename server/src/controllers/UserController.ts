import { Request, Response } from "express";
import UserModel from "../models/UserModel";

class UserController {
  // [GET] /user/get-info
  async getInfo(req: Request, res: Response): Promise<void> {
    const id = req.userId;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      res.status(400).json({
        error: "User doesn't exist",
      });
    } else {
      res.status(200).json({
        data: user,
      });
    }
  }

  // [GET] /user/get-list
  async getList(req: Request, res: Response): Promise<void> {
    const id = req.userId;
    const users = await UserModel.find({ _id: { $ne: id } });
    if (!users) {
      res.status(400).json({
        error: "User doesn't exist",
      });
      return;
    } else {
      res.status(200).json({
        data: users,
      });
      return;
    }
  }
}

export default new UserController();
