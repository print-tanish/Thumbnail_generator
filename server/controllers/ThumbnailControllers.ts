import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Thumbnail from "../models/Thumbnail.js";
import cloudinary from "../configs/cloudinary.js";
// Imports removed

/* ----------------------------------
   STYLE PROMPTS
---------------------------------- */
const stylePrompts = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",

  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",

  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",

  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",

  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
} as const;

/* ----------------------------------
   COLOR SCHEME DESCRIPTIONS
---------------------------------- */
const colorSchemeDescriptions = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon:
    "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and aesthetic",
} as const;

/* ----------------------------------
   GENERATE THUMBNAIL
---------------------------------- */
/* ----------------------------------
   TEMPLATE PACK PROMPTS
---------------------------------- */
const templatePackPrompts = {
  "MrBeast": "hyper-dramatic MrBeast style thumbnail, extreme facial expression, open mouth shock, high saturation, red arrows, massive scale elements, high stakes atmosphere, viral aesthetic, clean bold text",
  "Podcast": "professional podcast thumbnail, studio lighting, two people talking, microphone prominently visible, blurred background, split screen composition, high quality portraiture, engaging conversation vibe",
  "Gaming": "explosive gaming thumbnail, dynamic action shot, game character or avatar, glitch effects, neon lighting, speed lines, intense energy, victory or shock moment, esports aesthetic",
  "Finance": "finance and crypto thumbnail, rising green charts, money elements, gold coins, shocked or serious expression, professional suit, blurred city background, clean minimalistic text overlay",
} as const;

/* ----------------------------------
   GENERATE THUMBNAIL
---------------------------------- */
export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      templatePack,
    } = req.body; // req.body might be textual if multipart, express/multer handles this.

    // Check Credits First
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.credits < 1) {
      return res.status(403).json({
        message: "Insufficient credits",
        error: "insufficient_credits"
      });
    }

    /* ----------------------------------
       CREATE INITIAL DB ENTRY
    ---------------------------------- */
    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      templatePack,
      isGenerating: true,
    });

    // Ensure dotenv & GenAI
    // @ts-ignore
    const dotenv = await import("dotenv");
    dotenv.config();

    // @ts-ignore
    const { GoogleGenAI } = await import("@google/genai");

    // Runtime fix for Cloudinary URL if needed
    if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith("CLOUDINARY_URL=")) {
      process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL.replace("CLOUDINARY_URL=", "");
    }

    // Explicit Cloudinary Config
    if (process.env.CLOUDINARY_URL) {
      const cleanUrl = process.env.CLOUDINARY_URL.replace("CLOUDINARY_URL=", "");
      const matches = cleanUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^]+)$/);
      if (matches) {
        cloudinary.config({
          cloud_name: matches[3],
          api_key: matches[1],
          api_secret: matches[2]
        });
      }
    }

    /* ----------------------------------
       HANDLE FACE UPLOAD (Optional)
    ---------------------------------- */
    let faceDescription = "";

    // @ts-ignore
    if (req.file) {
      fs.appendFileSync(path.join(process.cwd(), "debug.log"), `\n--- Face Upload Start ---\n`);
      fs.appendFileSync(path.join(process.cwd(), "debug.log"), `File received: ${req.file.originalname} | Size: ${req.file.size} | Mime: ${req.file.mimetype}\n`);

      console.log("Processing Face Upload...");

      const imagesDir = path.join(process.cwd(), "images");
      if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

      const tempUploadPath = path.join(imagesDir, `upload-${Date.now()}.png`);
      // @ts-ignore
      fs.writeFileSync(tempUploadPath, req.file.buffer);

      try {
        // Upload Reference to Cloudinary
        console.log("Uploading to Cloudinary...");
        fs.appendFileSync(path.join(process.cwd(), "debug.log"), "Uploading to Cloudinary...\n");

        const uploadRef = await cloudinary.uploader.upload(tempUploadPath, { resource_type: "image" });
        const refUrl = uploadRef.secure_url;
        console.log("Face uploaded to Cloudinary:", refUrl);
        fs.appendFileSync(path.join(process.cwd(), "debug.log"), `Face uploaded to Cloudinary: ${refUrl}\n`);

        // ANALYZE FACE with Gemini 1.5 Flash
        console.log("Analyzing face with Gemini 1.5 Flash...");
        fs.appendFileSync(path.join(process.cwd(), "debug.log"), "Analyzing face with Gemini 1.5 Flash...\n");

        const analysisClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });

        const fileBuffer = fs.readFileSync(tempUploadPath);
        const imageBase64 = fileBuffer.toString("base64");

        const analysisResp = await analysisClient.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [
            {
              parts: [
                { text: "Describe the person's face in this image in extreme detail (gender, age, hair style and color, eye color, facial hair, glasses, distinct features). Output ONLY the physical description." },
                { inlineData: { mimeType: "image/png", data: imageBase64 } }
              ]
            }
          ]
        });

        faceDescription = analysisResp?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("Face Description Generated:", faceDescription);
        fs.appendFileSync(path.join(process.cwd(), "debug.log"), `Face Description Generated: ${faceDescription}\n`);

      } catch (err) {
        console.error("Face Analysis Failed:", err);
        fs.appendFileSync(path.join(process.cwd(), "debug.log"), `Face Analysis Failed: ${JSON.stringify(err)}\n`);
      } finally {
        if (fs.existsSync(tempUploadPath)) fs.unlinkSync(tempUploadPath);
      }
    } else {
      console.log("No file uploaded in req.file");
      fs.appendFileSync(path.join(process.cwd(), "debug.log"), "No file uploaded in req.file\n");
    }

    /* ----------------------------------
       BUILD PROMPT
    ---------------------------------- */
    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts] || "custom"} thumbnail for: "${title}". `;

    if (templatePack && templatePackPrompts[templatePack as keyof typeof templatePackPrompts]) {
      prompt += `\nSTYLE OVERRIDE: ${templatePackPrompts[templatePack as keyof typeof templatePackPrompts]}. `;
    }

    if (faceDescription) {
      prompt += `\nCHARACTER DETAILS: The main character in the thumbnail MUST look like this: ${faceDescription}. `;
      prompt += `Ensure the facial features, hair, and age match exactly. `;
    }

    if (color_scheme) {
      prompt += `Use a ${colorSchemeDescriptions[
        color_scheme as keyof typeof colorSchemeDescriptions
      ] || "vibrant"} color scheme. `;
    }

    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }

    prompt += `The thumbnail should be ${aspect_ratio || "16:9"
      }, visually stunning, designed to maximize click-through rate.`;

    console.log("FINAL GENERATION PROMPT:", prompt);
    fs.appendFileSync(path.join(process.cwd(), "debug.log"), `FINAL GENERATION PROMPT: ${prompt}\n\n`);

    /* ----------------------------------
       GENERATE THUMBNAIL (Imagen 4)
    ---------------------------------- */
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });

    const response = await client.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspect_ratio || "16:9",
      }
    });

    // Check for image data
    const generatedImage = response?.generatedImages?.[0]?.image;

    if (!generatedImage || !generatedImage.imageBytes) {
      console.error("Invalid AI Response:", JSON.stringify(response, null, 2));
      thumbnail.isGenerating = false;
      await thumbnail.save();
      throw new Error("No image generated or invalid response format");
    }

    const imageBuffer = Buffer.from(generatedImage.imageBytes, "base64");

    /* ----------------------------------
       SAVE & UPLOAD RESULT
    ---------------------------------- */
    const imagesDir = path.join(process.cwd(), "images");
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const filePath = path.join(imagesDir, `thumb-${Date.now()}.png`);
    fs.writeFileSync(filePath, imageBuffer);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    /* ----------------------------------
       UPDATE DB & DEDUCT CREDITS
    ---------------------------------- */
    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    // Deduct credit
    user.credits -= 1;
    await user.save();

    fs.unlinkSync(filePath);

    return res.json({
      message: "Thumbnail generated successfully",
      thumbnail,
      remainingCredits: user.credits
    });
  } catch (error: any) {
    console.error("Generate Thumbnail Error:", error);
    fs.appendFileSync(path.join(process.cwd(), 'server_error.log'), `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);
    fs.appendFileSync(path.join(process.cwd(), 'debug.log'), `ERROR: ${error.message}\n${error.stack}\n\n`);

    return res.status(500).json({
      message: error.message || "Internal server error",
      stack: error.stack
    });
  }
};

/* ----------------------------------
   DELETE THUMBNAIL
---------------------------------- */
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const deleted = await Thumbnail.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    return res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
