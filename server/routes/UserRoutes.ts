import express from "express";
import {
  getThumbnailbyId,
  getUsersThumbnails,
} from "../controllers/UserController.js";
import protect from "../middlewares/auth.js";

const UserRouter = express.Router();

// Get all thumbnails of logged-in user
UserRouter.get("/thumbnails", protect, getUsersThumbnails);

// Get single thumbnail by ID
UserRouter.get("/thumbnail/:id", protect, getThumbnailbyId);

export default UserRouter;
