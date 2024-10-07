import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authToken(req: Request, res: Response, next: NextFunction): void {
  const authorizationHeader: string | undefined = req.headers["authorization"];

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

  let accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";

  if (!accessTokenSecret) {
    res.status(500).json({ error: "Missing refresh token secret" });
    return;
  }

  let decoded = jwt.verify(token, accessTokenSecret) as jwt.JwtPayload;

  if (!decoded) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.userId = decoded.id;
  console.log(req.userId)
  next();
}

export default authToken;
