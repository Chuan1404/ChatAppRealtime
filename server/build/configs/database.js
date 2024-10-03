"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server = "127.0.0.1:27017";
const database = "chat-app";
function connect() {
    mongoose_1.default
        .connect(`mongodb://${server}/${database}`)
        .then(() => {
        console.log("Database connection successful");
    })
        .catch((err) => {
        console.error("Database connection error");
    });
}
exports.default = {
    connect
};
