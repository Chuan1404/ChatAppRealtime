"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authToken(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        res.status(401).json({
            error: "Missing aithorization header",
        });
        return;
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({
            error: "Unauthorize",
        });
        return;
    }
    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
    if (!accessTokenSecret) {
        res.status(500).json({ error: "Missing refresh token secret" });
        return;
    }
    try {
        let decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
}
exports.default = authToken;
