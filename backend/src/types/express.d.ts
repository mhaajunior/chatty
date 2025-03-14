import { Request } from "express";
import { Document, ObjectId } from "mongodb";

interface UserDocument extends Document {
  _id: ObjectId;
  email: string;
  fullName: string;
  profilePic?: string;
}

declare module "express" {
  export interface Request {
    user?: UserDocument;
  }
}
