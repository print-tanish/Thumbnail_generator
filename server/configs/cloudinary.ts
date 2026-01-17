import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary will automatically use CLOUDINARY_URL from environment variables
// BUT we strictly sanitize it here to prevent common copy-paste errors (e.g. "CLOUDINARY_URL=cloudinary://...")

if (process.env.CLOUDINARY_URL) {
    let url = process.env.CLOUDINARY_URL;

    // Fix: Remove "CLOUDINARY_URL=" prefix if accidentally pasted
    if (url.startsWith("CLOUDINARY_URL=")) {
        console.log("Fixing malformed CLOUDINARY_URL env var...");
        url = url.replace("CLOUDINARY_URL=", "");
        process.env.CLOUDINARY_URL = url; // Update env for SDK
    }

    // Explicitly configure if we can parse it, to be 100% sure
    const regex = /^cloudinary:\/\/([^:]+):([^@]+)@([^]+)$/;
    const match = url.match(regex);
    if (match) {
        cloudinary.config({
            cloud_name: match[3],
            api_key: match[1],
            api_secret: match[2],
            secure: true
        });
    }
}

export default cloudinary;
