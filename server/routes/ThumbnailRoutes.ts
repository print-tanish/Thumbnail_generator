import express from "express";
import {
  deleteThumbnail,
  generateThumbnail,
} from "../controllers/ThumbnailControllers.js";
import protect from "../middlewares/auth.js";

const ThumbnailRouter = express.Router();

ThumbnailRouter.post("/generate-thumbnail", protect, generateThumbnail);
ThumbnailRouter.delete("/:id", protect, deleteThumbnail);

export default ThumbnailRouter;
