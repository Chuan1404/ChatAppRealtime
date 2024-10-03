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
            return res.status(409).json({
                error: "Account already exists",
            });
        }
        else {
            const hashPassword = bcrypt_1.default.hashSync(body.password, 10);
            const model = new UserModel_1.default(req.body);
            model.password = hashPassword;
            let savedUser = yield model.save();
            if (!savedUser) {
                return res.status(400).json({
                    status: 400,
                    error: "Create user fail!",
                });
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
                return res.status(500).json({ error: "Server configuration error." });
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
            return res.status(200).json({
                data: {
                    accessToken,
                    refreshToken,
                },
            });
        }
    });
}
// [POST] /auth/sign-in
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const user = yield UserModel_1.default.findOne({ email: body.email });
        if (!user) {
            return res.status(400).json({
                error: "Email or password incorrect !",
            });
        }
        else {
            let password = user.password || "";
            if (!password)
                return res.status(400).json({
                    error: "Email or password incorrect !",
                });
            const isValidPassword = bcrypt_1.default.compareSync(body.password, password);
            if (!isValidPassword) {
                return res.status(400).json({
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
                    return res.status(500).json({ error: "Server configuration error." });
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
                return res.status(200).json({
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
        const token = req.body.refreshToken;
        if (!token) {
            return res.status(400).json({ error: "Missing refresh token" });
        }
        let tokenModel = yield TokenModel_1.default.findOne({ token });
        if (!tokenModel) {
            return res.status(401).json({
                error: "UnAuthorized",
            });
        }
        let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
        if (!refreshTokenSecret) {
            return res.status(500).json({ error: "Missing refresh token secret" });
        }
        let decoded = jsonwebtoken_1.default.verify(token, refreshTokenSecret);
        if (!decoded) {
            yield TokenModel_1.default.deleteOne({ token });
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payload = {
            id: decoded.id,
            email: decoded.email,
        };
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15m";
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
        if (!accessTokenSecret) {
            return res.status(500).json({ error: "Missing access token secret" });
        }
        let accessToken = jsonwebtoken_1.default.sign(payload, accessTokenSecret, {
            expiresIn: accessTokenLife,
        });
        return res.status(200).json({
            data: {
                accessToken,
                refreshToken: token,
            },
        });
    });
}
exports.default = {
    signUp,
    signIn,
    refreshToken,
};
