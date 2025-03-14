import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "../lib/customErrors";
import User from "../models/user.model";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new UnauthorizedError("Unauthorized - No Token Provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      throw new UnauthorizedError("Unauthorized - Invalid Token");
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
