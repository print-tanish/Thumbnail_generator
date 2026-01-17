import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary will automatically use CLOUDINARY_URL from environment variables
// BUT we strictly sanitize it here to prevent common copy-paste errors (e.g. "CLOUDINARY_URL=cloudinary://...")

if (process.env.CLOUDINARY_URL) {
    let url = process.env.CLOUDINARY_URL;

    // 1. Sanitize: Remove "CLOUDINARY_URL=" prefix if present
    if (url.startsWith("CLOUDINARY_URL=")) {
        console.log("Sanitizing CLOUDINARY_URL...");
        url = url.replace("CLOUDINARY_URL=", "").trim();
        process.env.CLOUDINARY_URL = url; // Update env for SDK
    }

    if (url.startsWith("cloudinary://")) {
        try {
            // 2. Parse manually to ensure specific config is applied
            // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
            const [auth, cloud_name] = url.split('@');
            const [start, api_secret] = auth.split(':'); // api_key might have : but usually safe, wait, structure is cloudinary://key:secret

            // Better regex approach:
            const regex = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;
            const match = url.match(regex);

            if (match) {
                cloudinary.config({
                    cloud_name: match[3],
                    api_key: match[1],
                    api_secret: match[2],
                    secure: true
                });
                console.log("Cloudinary configured explicitly from URL.");
            } else {
                console.warn("Could not parse Cloudinary URL with regex, relying on automatic SDK configuration.");
            }
        } catch (e) {
            console.error("Error parsing Cloudinary URL:", e);
        }
    } else {
        console.error("Invalid Cloudinary URL Protocol: URL does not start with 'cloudinary://'");
        // Don't crash here, let the SDK throw if it must, or we might log credentials.
    }
}

export default cloudinary;
