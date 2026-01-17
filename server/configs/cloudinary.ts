import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// CRITICAL FIX: The Cloudinary SDK attempts to automatically parse 'CLOUDINARY_URL'
// if it exists in process.env. If malformed, it throws a crash.
// We capture it, DELETE it from env to stop different SDK behavior,
// and then manually configure the SDK with sanitized values.

const rawUrl = process.env.CLOUDINARY_URL;

if (rawUrl) {
    // 1. Delete from env to prevent SDK auto-crash
    delete process.env.CLOUDINARY_URL;

    try {
        let url = rawUrl;

        // 2. Aggressive Sanitization
        // Remove "CLOUDINARY_URL=" prefix (case insensitive)
        url = url.replace(/CLOUDINARY_URL=/i, "");

        // Remove quotes if user added them
        url = url.replace(/['"]/g, "");

        // Remove whitespace
        url = url.trim();

        // 3. Ensure Protocol
        if (!url.startsWith("cloudinary://")) {
            // If user just pasted the key/secret part without protocol (rare, but possible)
            // or if it's completely broken.
            console.error("Cloudinary Config Error: URL is missing 'cloudinary://' protocol.");
        } else {
            // 4. Manual Parse
            // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
            const regex = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;
            const match = url.match(regex);

            if (match) {
                const [, apiKey, apiSecret, cloudName] = match;

                cloudinary.config({
                    cloud_name: cloudName,
                    api_key: apiKey,
                    api_secret: apiSecret,
                    secure: true
                });

                console.log(`Cloudinary configured successfully for cloud: ${cloudName}`);
            } else {
                console.error("Cloudinary Config Error: Could not parse URL structure.");
            }
        }
    } catch (error) {
        console.error("Cloudinary Config Exception:", error);
    }
} else {
    // Check if separate vars are set (fallback)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
    }
}

export default cloudinary;
