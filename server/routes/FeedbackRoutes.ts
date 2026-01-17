import express from "express";
import { submitFeedback } from "../controllers/FeedbackControllers.js";
import protect from "../middlewares/auth.js";

const FeedbackRouter = express.Router();

FeedbackRouter.post("/", protect, submitFeedback);

export default FeedbackRouter;
