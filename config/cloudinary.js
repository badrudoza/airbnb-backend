import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

// ✅ configure once (not inside function ideally)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto"
    });

    // ✅ SAFE DELETE (no crash)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary Error:", error);

    // ✅ SAFE DELETE EVEN ON ERROR
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return null;
  }
};

export default uploadOnCloudinary;