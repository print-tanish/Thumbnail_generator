import { Request, Response } from "express";
import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { rating, comment } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "You must be logged in to submit feedback." });
        }

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required." });
        }

        const feedback = await Feedback.create({
            userId,
            rating,
            comment,
        });

        return res.status(201).json({ message: "Feedback submitted successfully!", feedback });
    } catch (error: any) {
        console.error("Feedback Submission Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
