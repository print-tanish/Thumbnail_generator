import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary will automatically use CLOUDINARY_URL from environment variables

export default cloudinary;
