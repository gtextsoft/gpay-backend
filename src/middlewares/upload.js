import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gpay_users",
    allowed_formats: ["jpeg", "jpg", "png"], // Restrict formats
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const kycStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gpayKyc",
    allowed_formats: ["pdf", "doc", "docx", "png", "jpg", "jpeg"], // Restrict formats
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// Cloudinary Storage for Documents (PDFs, Docs, etc.)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gpayFile",
    allowed_formats: ["pdf", "doc", "docx"], // Restrict formats
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// Cloudinary Storage for Multer
const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gpayImages",
    allowed_formats: ["jpeg", "jpg", "png"], // Restrict formats
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });
const uploadDocument = multer({ storage: documentStorage });
const uploadProperty = multer({ storage: propertyStorage });
const uploadKyc = multer({ storage: kycStorage });

export { upload, uploadDocument, uploadProperty, uploadKyc};

