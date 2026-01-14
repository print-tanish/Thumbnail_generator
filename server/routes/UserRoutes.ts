import express from "express";
import {
  getThumbnailbyId,
  getUsersThumbnails,
} from "../controllers/UserController.js";

const UserRouter = express.Router();

// Get all thumbnails of logged-in user
UserRouter.get("/thumbnails", getUsersThumbnails);

// Get single thumbnail by ID
UserRouter.get("/thumbnail/:id", getThumbnailbyId);

export default UserRouter;
