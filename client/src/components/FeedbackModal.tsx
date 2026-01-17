import { useState } from "react";
import axios from "axios";
import { Star, X, MessageSquarePlus } from "lucide-react";
import { Button } from "./ui";
import { motion, AnimatePresence } from "motion/react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return alert("Please select a rating.");
        if (!comment.trim()) return alert("Please provide a comment.");

        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/feedback`,
                { rating, comment },
                { withCredentials: true }
            );
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setRating(0);
                setComment("");
            }, 2000);
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {!submitted ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquarePlus className="text-pink-500" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">We Value Your Feedback</h3>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Help us improve ClickNail AI.
                                </p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-zinc-600"
                                            }`}
                                    >
                                        <Star
                                            size={32}
                                            fill={star <= rating ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts, suggestions, or bug reports..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none h-32 text-sm"
                            />

                            <Button
                                onClick={handleSubmit}
                                isLoading={loading}
                                className="w-full shadow-lg shadow-pink-500/20"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="text-green-500" size={32} fill="currentColor" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-zinc-400">Your feedback has been recorded.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
