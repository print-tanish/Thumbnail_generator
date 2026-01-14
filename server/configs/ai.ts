import { GoogleGenAI } from "@google/genai";

const googleGenAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export default googleGenAI;
