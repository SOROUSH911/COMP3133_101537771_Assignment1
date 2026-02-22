const cloudinary = require('cloudinary').v2;

let configured = false;

const ensureConfigured = () => {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    configured = true;
  }
};

const uploadImage = async (imageData) => {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(imageData, {
    folder: 'employee_photos',
    resource_type: 'image'
  });
  return result.secure_url;
};

module.exports = { uploadImage, cloudinary };
