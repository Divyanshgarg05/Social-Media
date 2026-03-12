import '../env.js';
import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "social_media_posts",
    allowed_formats: ["jpg", "png", "jpeg","gif","webp"],
    resource_type: "auto"
  }
});

const upload = multer({ storage });

export { cloud, upload };