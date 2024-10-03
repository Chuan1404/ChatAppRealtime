import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authToken(req: Request, res: any, next: NextFunction) {
  const authorizationHeader: string | undefined = req.headers["authorization"];

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

  let accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";

  if (!accessTokenSecret)
    return res.status(500).json({ error: "Missing refresh token secret" });

  let decoded = jwt.verify(token, accessTokenSecret) as jwt.JwtPayload;

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userId = decoded.id;
  return next();
}

export default authToken
