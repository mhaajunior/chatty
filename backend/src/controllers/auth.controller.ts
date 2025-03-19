import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../lib/customErrors";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../lib/jwt";
import cloudinary from "../lib/cloudinary";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password } = req.body;

  try {
    if (!email || !password || !fullName) {
      throw new BadRequestError("All fields are required");
    }

    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      await newUser.save();
      generateToken(newUser._id, res);

      res.status(201).json({
        success: true,
        message: "Signup successfully",
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      throw new BadRequestError("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
    }

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    if (!profilePic) {
      throw new BadRequestError("Profile picture is required");
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Update user successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("error ", error);
    next(error);
  }
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
