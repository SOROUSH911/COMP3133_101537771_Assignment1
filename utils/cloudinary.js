const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (imageData) => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'employee_photos',
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

module.exports = { uploadImage, cloudinary };
