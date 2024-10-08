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
const TokenModel_1 = __importDefault(require("../models/TokenModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// [POST] /auth/register
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (req.file) {
            body.avatar = "images/" + req.file.filename;
        }
        const existedUser = yield UserModel_1.default.findOne({ email: body.email });
        if (existedUser) {
            res.status(409).json({
                error: "Account already exists",
            });
            return;
        }
        else {
            const hashPassword = bcrypt_1.default.hashSync(body.password, 10);
            const model = new UserModel_1.default(req.body);
            model.password = hashPassword;
            let savedUser = yield model.save();
            if (!savedUser) {
                res.status(400).json({
                    status: 400,
                    error: "Create user fail!",
                });
                return;
            }
            const payload = {
                id: savedUser._id,
                email: savedUser.email,
            };
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15m";
            const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1d";
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
            if (!accessTokenSecret || !refreshTokenSecret) {
                res.status(500).json({ error: "Server configuration error." });
                return;
            }
            let accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
                expiresIn: accessTokenLife,
            });
            let refreshToken = jsonwebtoken_1.default.sign(payload, refreshTokenSecret, {
                expiresIn: refreshTokenLife,
            });
            TokenModel_1.default.create({
                token: refreshToken,
            });
            res.status(200).json({
                data: {
                    accessToken,
                    refreshToken,
                },
            });
            return;
        }
    });
}
// [POST] /auth/sign-in
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const user = yield UserModel_1.default.findOne({ email: body.email });
        if (!user) {
            res.status(400).json({
                error: "Email or password incorrect !",
            });
            return;
        }
        else {
            if (!user.password || !body.password) {
                res.status(400).json({
                    error: "Email or password incorrect !",
                });
                return;
            }
            const isValidPassword = bcrypt_1.default.compareSync(body.password, user.password);
            if (!isValidPassword) {
                res.status(400).json({
                    error: "Email or password incorrect !",
                });
            }
            else {
                const payload = {
                    id: user._id,
                    email: user.email,
                };
                const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15m";
                const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1d";
                const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
                const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
                if (!accessTokenSecret || !refreshTokenSecret) {
                    res.status(500).json({ error: "Server configuration error." });
                    return;
                }
                let accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
                    expiresIn: accessTokenLife,
                });
                let refreshToken = jsonwebtoken_1.default.sign(payload, refreshTokenSecret, {
                    expiresIn: refreshTokenLife,
                });
                TokenModel_1.default.create({
                    token: refreshToken,
                });
                res.status(200).json({
                    data: {
                        accessToken,
                        refreshToken,
                    },
                });
            }
        }
    });
}
// [POST] /auth/refresh-token
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken: token } = req.body;
        if (!token) {
            res.status(400).json({ error: "Missing refresh token" });
            return;
        }
        let tokenModel = yield TokenModel_1.default.findOne({ token });
        if (!tokenModel) {
            res.status(401).json({
                error: "UnAuthorized",
            });
            return;
        }
        let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
        if (!refreshTokenSecret) {
            res.status(500).json({ error: "Missing refresh token secret" });
            return;
        }
        try {
            let decoded = jsonwebtoken_1.default.verify(token, refreshTokenSecret);
            const payload = {
                id: decoded.id,
                email: decoded.email,
            };
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15m";
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
            if (!accessTokenSecret) {
                res.status(500).json({ error: "Missing access token secret" });
                return;
            }
            let accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
                expiresIn: accessTokenLife,
            });
            res.status(200).json({
                data: {
                    accessToken,
                    refreshToken: token,
                },
            });
        }
        catch (err) {
            yield TokenModel_1.default.deleteOne({ token });
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
    });
}
exports.default = {
    signUp,
    signIn,
    refreshToken,
};
