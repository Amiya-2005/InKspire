const cloudinary = require("cloudinary").v2;
require("dotenv").config();


exports.cloudinaryConnect = () => {
    try{
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.API_SECRET,
        })
        console.log("Cloudinary connected successfully.✅")
    }
    catch(err){
        console.log(err);
        console.log("Cloudinary could not be connected.❌")
    }
}

exports.uploadFileToCloudinary = async (file, folder, quality) => {
    const options = {
      folder,
      resource_type: "auto",
    };
    if (quality) options.quality = quality;
  
    console.log("Cloudinary options:", options);
  
    try {
      const up = await cloudinary.uploader.upload(file.tempFilePath, options);
      return up;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }