import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
    console.error("❌ CLOUDINARY_URL is not set in environment variables");
} else if (!cloudinaryUrl.startsWith("cloudinary://")) {
    console.error("❌ Invalid CLOUDINARY_URL format. Should start with 'cloudinary://'");
    console.error("Current value:", cloudinaryUrl);
} else {
    try {
        // Parse the URL manually to avoid any SDK parsing issues
        const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);

        if (match) {
            const [, apiKey, apiSecret, cloudName] = match;

            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true
            });

            console.log(`✅ Cloudinary configured successfully for cloud: ${cloudName}`);
        } else {
            console.error("❌ Could not parse CLOUDINARY_URL. Expected format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME");
        }
    } catch (error) {
        console.error("❌ Error configuring Cloudinary:", error);
    }
}

export default cloudinary;