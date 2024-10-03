"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const chatRoute_1 = __importDefault(require("./chatRoute"));
function routes(app) {
    app.use("/auth", authRoute_1.default);
    app.use("/user", userRoute_1.default);
    app.use("/chat", chatRoute_1.default);
}
exports.default = routes;
