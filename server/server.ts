import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./configs/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import FeedbackRouter from "./routes/FeedbackRoutes.js";

/* ---------- SESSION TYPES ---------- */
declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: false, // Set to true if using https
      httpOnly: true,
      sameSite: "lax",
    },

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  })
);

/* ---------- SERVER ---------- */

const startServer = async () => {
  try {
    await connectDB();

    app.get("/", (req: Request, res: Response) => {
      res.send("Server is Live!");
    });

    app.use("/api/auth", AuthRouter);
    app.use('/api/thumbnail', ThumbnailRouter);
    app.use('/api/user', UserRouter);
    app.use('/api/feedback', FeedbackRouter);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
