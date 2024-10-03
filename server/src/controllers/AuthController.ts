import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import TokenModel from "../models/TokenModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// [POST] /auth/register
async function signUp(req: Request, res: Response): Promise<any> {
  const body = req.body;

  if (req.file) {
    body.avatar = "images/" + req.file.filename;
  }
  const existedUser = await UserModel.findOne({ email: body.email });

  if (existedUser) {
    return res.status(409).json({
      error: "Account already exists",
    });
  } else {
    const hashPassword = bcrypt.hashSync(body.password, 10);
    const model = new UserModel(req.body);
    model.password = hashPassword;

    let savedUser = await model.save();
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

    const accessTokenLife: string = process.env.ACCESS_TOKEN_LIFE || "15m";
    const refreshTokenLife: string = process.env.REFRESH_TOKEN_LIFE || "1d";
    const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
    const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";

    if (!accessTokenSecret || !refreshTokenSecret) {
      return res.status(500).json({ error: "Server configuration error." });
    }

    let accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenLife,
    });
    let refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenLife,
    });

    TokenModel.create({
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

// [POST] /auth/sign-in
async function signIn(req: Request, res: Response): Promise<any> {
  const body = req.body;
  const user = await UserModel.findOne({ email: body.email });

  if (!user) {
    return res.status(400).json({
      error: "Email or password incorrect !",
    });
  } else {
    let password: string = user.password || "";

    if (!password)
      return res.status(400).json({
        error: "Email or password incorrect !",
      });

    const isValidPassword = bcrypt.compareSync(body.password, password);

    if (!isValidPassword) {
      return res.status(400).json({
        error: "Email or password incorrect !",
      });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
      };

      const accessTokenLife: string = process.env.ACCESS_TOKEN_LIFE || "15m";
      const refreshTokenLife: string = process.env.REFRESH_TOKEN_LIFE || "1d";
      const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
      const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";

      if (!accessTokenSecret || !refreshTokenSecret) {
        return res.status(500).json({ error: "Server configuration error." });
      }

      let accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenLife,
      });
      let refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: refreshTokenLife,
      });

      TokenModel.create({
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
}

// [POST] /auth/refresh-token
async function refreshToken(req: Request, res: Response): Promise<any> {
  const token: string | undefined = req.body.refreshToken;
  if (!token) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  let tokenModel = await TokenModel.findOne({ token });
  if (!tokenModel) {
    return res.status(401).json({
      error: "UnAuthorized",
    });
  }

  let refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";
  if (!refreshTokenSecret) {
    return res.status(500).json({ error: "Missing refresh token secret" });
  }

  let decoded = jwt.verify(token, refreshTokenSecret) as jwt.JwtPayload;
  if (!decoded) {
    await TokenModel.deleteOne({ token });
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

  let accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenLife,
  });

  return res.status(200).json({
    data: {
      accessToken,
      refreshToken: token,
    },
  });
}

export default {
  signUp,
  signIn,
  refreshToken,
};
