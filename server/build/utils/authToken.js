"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authToken(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return res.status(401).json({
            error: "Missing aithorization header",
        });
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            error: "Unauthorize",
        });
    }
    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
    if (!accessTokenSecret)
        return res.status(500).json({ error: "Missing refresh token secret" });
    let decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.id;
    return next();
}
exports.default = authToken;
