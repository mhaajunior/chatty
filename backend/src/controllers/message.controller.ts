import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { getRecieverSocketId, io } from "../lib/socket";

export const getUsersForSidebar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl;
    if (image) {
      const uplaodResponse = await cloudinary.uploader.upload(image);
      imageUrl = uplaodResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(recieverId);
    // if user is online
    if (recieverSocketId) {
      // send message to specific user
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
