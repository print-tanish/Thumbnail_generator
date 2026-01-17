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
        credits: newUser.credits
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
        credits: user.credits
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
  // Clear the cookie explicitly
  res.clearCookie('connect.sid');

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

/* ============================
   Google Login
============================ */
// Import OAuth2Client directly since it's a specific class import
import { OAuth2Client } from "google-auth-library";

// Initialize client - using a placeholder or env variable
// IMPORTANT: We need the actual CLIENT_ID for verification to work securely in production
// but for development we can sometimes proceed if we trust the source or just verify structure.
// However, google-auth-library REQUIRES a client ID to verify properly.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID");

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not found in token" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - check if googleId is linked, if not, link it
      if (!user.googleId) {
        user.googleId = googleId;
        // Verify if avatar exists, if not update it
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: name || "User",
        email,
        googleId,
        avatar: picture,
      });
      await user.save();
    }

    // Set session
    req.session.isLoggedIn = true;
    req.session.userId = user._id as any; // Cast to any to avoid type issues with _id

    return res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        avatar: user.avatar
      },
    });

  } catch (error: any) {
    console.error("Google Login Error:", error);
    return res.status(500).json({
      message: "Internal server error during Google Login",
      error: error.message
    });
  }
};
