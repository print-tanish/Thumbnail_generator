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

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "https://nailclick.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Date", "X-Api-Version"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.set('trust proxy', 1)

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  })
);

/* ---------- SERVER ---------- */

/* ---------- SERVER ---------- */

// Connect to DB immediately (Mongoose buffers requests)
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/auth", AuthRouter);
app.use('/api/thumbnail', ThumbnailRouter);
app.use('/api/user', UserRouter);
app.use('/api/feedback', FeedbackRouter);

// Only listen if not running on Vercel (Vercel handles the server)
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;
