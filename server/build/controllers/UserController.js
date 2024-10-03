"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
class UserController {
    // [GET] /user/get-info
    getInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            const user = yield UserModel_1.default.findOne({ _id: id });
            if (!user) {
                return res.status(400).json({
                    error: "User doesn't exist",
                });
            }
            else {
                return res.status(200).json({
                    data: user,
                });
            }
        });
    }
    // [GET] /user/get-list
    getList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            const users = yield UserModel_1.default.find({ _id: { $ne: id } });
            if (!users) {
                return res.status(400).json({
                    error: "User doesn't exist",
                });
            }
            else {
                return res.status(200).json({
                    data: users,
                });
            }
        });
    }
}
exports.default = new UserController();
