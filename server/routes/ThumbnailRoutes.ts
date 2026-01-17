import express from "express";
import {
  deleteThumbnail,
  generateThumbnail,
} from "../controllers/ThumbnailControllers.js";
import protect from "../middlewares/auth.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const ThumbnailRouter = express.Router();

ThumbnailRouter.post("/generate-thumbnail", protect, upload.single("image"), generateThumbnail);
ThumbnailRouter.delete("/:id", protect, deleteThumbnail);

export default ThumbnailRouter;
