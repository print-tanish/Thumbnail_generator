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

if (!process.env.MONGODB_URI) {
  console.error("Critical Error: MONGODB_URI is not defined.");
}

/* ---------- MIDDLEWARE ---------- */

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "https://nailclick.vercel.app",
    "https://nailclick-server.vercel.app" // Add your backend URL too
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Date",
    "X-Api-Version"
  ]
};

// Apply CORS before other middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

// Connect to DB immediately (Mongoose buffers requests)
connectDB().catch(err => console.error("Top-level DB connection error:", err));

// Session middleware
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
    store: (MongoStore as any).create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  })
);

/* ---------- ROUTES ---------- */

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is Live!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", AuthRouter);
app.use('/api/thumbnail', ThumbnailRouter);
app.use('/api/user', UserRouter);
app.use('/api/feedback', FeedbackRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Only listen if not on Vercel
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;