import cloudinary from '../config/cloudinary.js';

/**
 * Upload file to Cloudinary
 * @param {string} fileBuffer - Base64 encoded file or file path
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Cloudinary URL
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'career-roadmap') => {
  try {
    const result = await cloudinary.uploader.upload(fileBuffer, {
      folder: folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};
