import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

/* ============================
   Register User
============================ */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // set session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    return res.json({
      message: "Account created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* ============================
   Login User
============================ */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // set session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    return res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ============================
   Logout User
============================ */
export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((error: any) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.json({
      message: "Logout successful",
    });
  });
};

/* ============================
   Verify User
============================ */
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    return res.json({
      user,
    });
  } catch (error: any) {
    console.error("Verify Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
