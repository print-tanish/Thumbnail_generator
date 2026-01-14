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
      text_overlay,
    } = req.body;

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
      text_overlay,
      isGenerating: true,
    });

    /* ----------------------------------
       BUILD PROMPT
    ---------------------------------- */
    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]
      } thumbnail for: "${title}". `;

    if (color_scheme) {
      prompt += `Use a ${colorSchemeDescriptions[
        color_scheme as keyof typeof colorSchemeDescriptions
      ]
        } color scheme. `;
    }

    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }

    prompt += `The thumbnail should be ${aspect_ratio || "16:9"
      }, visually stunning, designed to maximize click-through rate.`;

    /* ----------------------------------
       GEMINI / IMAGEN CONFIG
    ---------------------------------- */
    // Ensure dotenv is loaded
    // @ts-ignore
    const dotenv = await import("dotenv");
    dotenv.config();

    console.log("DEBUG: GEMINI_API_KEY exists?", !!process.env.GEMINI_API_KEY);

    // Runtime fix for common .env paste error
    if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith("CLOUDINARY_URL=")) {
      console.log("DEBUG: Fixing malformed CLOUDINARY_URL");
      process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL.replace("CLOUDINARY_URL=", "");
    }

    // @ts-ignore
    const { GoogleGenAI } = await import("@google/genai");
    // trying v1alpha as Imagen 3 is often in alpha/preview
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1alpha' });

    /* ----------------------------------
       GENERATE IMAGE (Imagen 4)
    ---------------------------------- */
    const response = await client.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspect_ratio || "16:9",
        // outputMimeType: "image/png" // Optional, defaults to png usually
      }
    });

    console.log("AI Response received");
    // console.log(JSON.stringify(response, null, 2)); // excessive logging might be bad, but helpful for debug

    // Check for image data from Imagen 3 response
    // Response structure for generateImages typically contains 'generatedImages' array
    const generatedImage = response?.generatedImages?.[0]?.image;

    if (!generatedImage || !generatedImage.imageBytes) {
      console.error("Invalid AI Response:", JSON.stringify(response, null, 2));
      throw new Error("No image generated or invalid response format");
    }

    const imageBuffer = Buffer.from(generatedImage.imageBytes, "base64");

    /* ----------------------------------
       SAVE TEMP FILE
    ---------------------------------- */
    const imagesDir = path.join(process.cwd(), "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, `thumb-${Date.now()}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    console.log("Temp file saved:", filePath);

    /* ----------------------------------
       UPLOAD TO CLOUDINARY
    ---------------------------------- */
    /* ----------------------------------
       UPLOAD TO CLOUDINARY
    ---------------------------------- */
    console.log("Uploading to Cloudinary...");

    // Explicitly configure Cloudinary to ensure keys are loaded
    if (process.env.CLOUDINARY_URL) {
      // Handle potential double prefix
      const cleanUrl = process.env.CLOUDINARY_URL.replace("CLOUDINARY_URL=", "");
      // Regex to parse: cloudinary://<api_key>:<api_secret>@<cloud_name>
      const matches = cleanUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^]+)$/);
      if (matches) {
        cloudinary.config({
          cloud_name: matches[3],
          api_key: matches[1],
          api_secret: matches[2]
        });
        console.log("DEBUG: Manually configured Cloudinary with parsed credentials");
      } else {
        console.log("DEBUG: Could not parse CLOUDINARY_URL, relying on auto-config");
      }
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    console.log("Cloudinary Upload Success:", uploadResult.secure_url);

    /* ----------------------------------
       UPDATE DB
    ---------------------------------- */
    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    fs.unlinkSync(filePath);

    return res.json({
      message: "Thumbnail generated successfully",
      thumbnail,
    });
  } catch (error: any) {
    console.error("Generate Thumbnail Error:", error);
    fs.appendFileSync(path.join(process.cwd(), 'server_error.log'), `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);

    // If we have a thumbnail ID, we might want to mark it as failed in DB? 
    // For now just return error.
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
